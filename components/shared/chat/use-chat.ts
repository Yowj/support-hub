"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, Ticket } from "@/types/ticket";

type UserRole = "customer" | "agent";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    const channel = supabase
      .channel(`ticket-${ticketId}`)
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, supabase]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    resizeTextarea();
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
    error,
    textareaRef,
    setError,
    handleTextareaChange,
    sendMessage,
  };
}
