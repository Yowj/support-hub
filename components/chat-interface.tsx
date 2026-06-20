"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, MessageCircle, AlertCircle, Loader2 } from "lucide-react";

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: "customer" | "agent" | "system";
  message: string;
  timestamp: string;
  read_at: string | null;
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  agent_id: string | null;
}

interface ChatInterfaceProps {
  ticketId: string;
  userId: string;
  userRole: "customer" | "agent";
  onClose: () => void;
  className?: string;
}

const CONTACT_NAME: Record<"customer" | "agent", string> = {
  customer: "Support Agent",
  agent: "Customer",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "open": return "bg-red-100 text-red-700 border-red-200";
    case "in_progress": return "bg-amber-100 text-amber-700 border-amber-200";
    case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "closed": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-700 border-red-200";
    case "high": return "bg-orange-100 text-orange-700 border-orange-200";
    case "medium": return "bg-blue-100 text-blue-700 border-blue-200";
    case "low": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export default function ChatInterface({ ticketId, userId, userRole, onClose, className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  const contactName = CONTACT_NAME[userRole];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticketId, supabase]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  // Group messages by date for date separators
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Unable to load chat</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className ?? "flex flex-col h-[calc(100vh-90px)] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Contact Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">{getInitials(contactName)}</span>
          </div>
          {ticket?.status !== "closed" && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 dark:text-white">{contactName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{ticket?.subject}</div>
        </div>

        {/* Status & Priority Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {ticket && (
            <>
              <span
                className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getStatusStyle(ticket.status)}`}
              >
                {ticket.status.replace("_", " ")}
              </span>
              <span
                className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getPriorityStyle(ticket.priority)}`}
              >
                {ticket.priority}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-lg">No messages yet</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
              Start the conversation! Your {contactName.toLowerCase()} will be notified when you send a message.
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date} className="space-y-1">
              {/* Date Separator */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {group.messages.map((message) => {
                const isMine = message.sender_id === userId;
                const isSystem = message.sender_type === "system";

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center py-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full italic">
                        {message.message}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {/* Receiver avatar */}
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm mb-5">
                        <span className="text-white font-semibold text-xs">{getInitials(contactName)}</span>
                      </div>
                    )}

                    <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
                      <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
                        {isMine ? "You" : contactName}
                      </span>
                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                          isMine
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm"
                        }`}
                      >
                        {message.message}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Sender avatar */}
                    {isMine && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm mb-5">
                        <span className="text-white font-semibold text-xs">Me</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800 flex-shrink-0">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-600 dark:text-red-400 flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      {ticket?.status !== "closed" ? (
        <div className="flex items-end gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex-1 flex items-end bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2 min-h-[44px]">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Aa"
              rows={1}
              disabled={isSending}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 max-h-[120px] overflow-y-auto leading-relaxed self-center"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            className="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 text-white dark:disabled:text-gray-500" />
            )}
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            This ticket has been closed and is no longer accepting messages.
          </p>
        </div>
      )}
    </div>
  );
}
