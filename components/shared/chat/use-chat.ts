"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message, Ticket } from "@/types/ticket";

type UserRole = "customer" | "agent";

// How long to keep showing the indicator after the last received "typing" event.
const TYPING_CLEAR_MS = 3000;
// Don't broadcast more than one "typing" event within this window.
const TYPING_THROTTLE_MS = 1500;

/**
 * Owns a single ticket conversation: loads the ticket + messages, subscribes to
 * realtime inserts, and exposes send + textarea auto-resize. Keeps ChatInterface
 * purely presentational.
 */
export function useChat(ticketId: string, userId: string, userRole: UserRole) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastTypingSentRef = useRef(0);
  const typingClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchTicketAndMessages = async () => {
      try {
        const [ticketResponse, messagesResponse] = await Promise.all([
          supabase.from("support_tickets").select("*").eq("id", ticketId).single(),
          supabase
            .from("chat_messages")
            .select("*")
            .eq("ticket_id", ticketId)
            .order("timestamp", { ascending: true }),
        ]);

        if (ticketResponse.error) throw ticketResponse.error;
        if (messagesResponse.error) throw messagesResponse.error;

        setTicket(ticketResponse.data);
        setMessages(messagesResponse.data || []);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching ticket data:", err);
        setError("Failed to load chat. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketAndMessages();

    // Messages channel: postgres_changes. This requires Realtime replication to
    // be enabled on `chat_messages` in the Supabase dashboard.
    const messagesChannel = supabase
      .channel(`ticket-${ticketId}-messages`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
          );
        }
      )
      .subscribe();

    // Typing channel: broadcast only. Kept SEPARATE from postgres_changes so it
    // still subscribes (and typing works) even when table replication is off —
    // broadcast needs no DB setup at all.
    const typingChannel = supabase
      .channel(`ticket-${ticketId}-typing`, { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "typing" }, (payload) => {
        // Ignore our own events (self:false already filters, but guard anyway).
        if (payload.payload?.senderId === userId) return;
        setIsOtherTyping(true);
        if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
        typingClearTimerRef.current = setTimeout(() => setIsOtherTyping(false), TYPING_CLEAR_MS);
      })
      .on("broadcast", { event: "stop_typing" }, (payload) => {
        if (payload.payload?.senderId === userId) return;
        if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
        setIsOtherTyping(false);
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Typing channel failed to subscribe:", status);
        }
      });

    channelRef.current = typingChannel;

    return () => {
      if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
      channelRef.current = null;
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [ticketId, userId, supabase]);

  /** Broadcasts that the local user is typing, throttled to avoid spamming the channel. */
  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_THROTTLE_MS) return;
    lastTypingSentRef.current = now;
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { senderId: userId, senderType: userRole },
    });
  }, [userId, userRole]);

  /** Tells the other party we've stopped typing (e.g. after sending a message). */
  const notifyStopTyping = useCallback(() => {
    lastTypingSentRef.current = 0;
    channelRef.current?.send({
      type: "broadcast",
      event: "stop_typing",
      payload: { senderId: userId, senderType: userRole },
    });
  }, [userId, userRole]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    resizeTextarea();
    if (e.target.value.trim()) notifyTyping();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      const { error: sendError } = await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: userId,
          sender_type: userRole,
          message: newMessage.trim(),
        },
      ]);
      if (sendError) throw sendError;
      setNewMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      notifyStopTyping();
      setError(null);
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return {
    ticket,
    messages,
    newMessage,
    isLoading,
    isSending,
    isOtherTyping,
    error,
    textareaRef,
    setError,
    handleTextareaChange,
    sendMessage,
  };
}
