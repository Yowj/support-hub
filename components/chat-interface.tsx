"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

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
}

export default function ChatInterface({ ticketId, userId, userRole, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

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
      } catch (error: any) {
        console.error("Error fetching ticket data:", error);
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
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: userId,
          sender_type: userRole,
          message: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      setNewMessage("");
      setError(null);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <span className="p-2">
              <Loader className="animate-spin" />
            </span>
            Loading chat...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !ticket) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className=" h-full max-h-[800px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ticket?.subject}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge className={getStatusColor(ticket?.status || "")}>{ticket?.status}</Badge>
              <Badge className={getPriorityColor(ticket?.priority || "")}>{ticket?.priority}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 h-full overflow-y-auto ">
        <div className=" p-4 space-y-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === userId
                    ? "bg-blue-500 text-white"
                    : message.sender_type === "system"
                    ? "bg-gray-100 text-gray-700 text-center italic"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm">{message.message}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>{" "}
      {ticket?.status !== "closed" && (
        <div className="border-t p-4">
          {error && (
            <div className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded border">
              {error}
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0"
              >
                ×
              </Button>
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={isSending || !newMessage.trim()}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
