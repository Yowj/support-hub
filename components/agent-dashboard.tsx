"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "./chat-interface";
import type { User } from "@supabase/supabase-js";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  customer_id: string;
  agent_id: string | null;
  customer_email?: string;
}

interface AgentDashboardProps {
  user: User;
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unassigned" | "assigned" | "mine">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("support_tickets")
        .select(
          `
    *,
    customer:user_profiles!customer_id (
      id,
      display_name,
      avatar_url
    )
  `
        )
        .neq("status", "closed")
        .order("created_at", { ascending: false });

      // Fixed switch statement with all cases
      switch (filter) {
        case "unassigned":
          query = query.is("agent_id", null);
          break;
        case "assigned":
          query = query.not("agent_id", "is", null);
          break;
        case "mine":
          query = query.eq("agent_id", user.id);
          break;
        case "all":
        default:
          // No additional filter - show all open tickets
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tickets:", error);
        // You can add toast notification here
        return;
      }

      // Fixed type-safe mapping
      const formattedTickets: Ticket[] = (data || []).map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        customer_id: ticket.customer_id,
        agent_id: ticket.agent_id,
        customer_email: ticket.customer?.display_name || "Unknown Customer",
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, user.id, supabase]);

  useEffect(() => {
    fetchTickets();

    // Set up real-time subscription for ticket updates
    const channel = supabase
      .channel("agent-tickets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
        },
        (payload) => {
          console.log("Ticket update received:", payload);
          // Refresh tickets when any change occurs
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, fetchTickets, supabase]);

  const assignTicket = async (ticketId: string) => {
    setAssigningTicketId(ticketId);
    try {
      const { error: updateError } = await supabase
        .from("support_tickets")
        .update({ agent_id: user.id, status: "in_progress" })
        .eq("id", ticketId);

      if (updateError) throw updateError;

      const { error: messageError } = await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: user.id,
          sender_type: "system",
          message: `Agent ${user.email} has been assigned to this ticket.`,
        },
      ]);

      if (messageError) throw messageError;

      await fetchTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      // You can add toast notification for error here
    } finally {
      setAssigningTicketId(null);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    setUpdatingTicketId(ticketId);
    try {
      const { error: updateError } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", ticketId);

      if (updateError) throw updateError;

      const { error: messageError } = await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: user.id,
          sender_type: "system",
          message: `Ticket status changed to ${status}.`,
        },
      ]);

      if (messageError) throw messageError;

      await fetchTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      // You can add toast notification for error here
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTicketCount = () => {
    const counts = {
      all: tickets.length,
      unassigned: tickets.filter((t) => !t.agent_id).length,
      assigned: tickets.filter((t) => t.agent_id !== null).length,
      mine: tickets.filter((t) => t.agent_id === user.id).length,
    };
    return counts[filter];
  };

  if (selectedTicketId) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedTicketId(null)} className="mb-4">
          ← Back to Queue
        </Button>
        <ChatInterface
          ticketId={selectedTicketId}
          userId={user.id}
          userRole="agent"
          onClose={() => setSelectedTicketId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Queue</h2>
          <p className="text-gray-600">
            Manage customer support tickets ({getTicketCount()} {filter})
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Open
          </Button>
          <Button
            variant={filter === "unassigned" ? "default" : "outline"}
            onClick={() => setFilter("unassigned")}
            size="sm"
          >
            Unassigned
          </Button>
          <Button
            variant={filter === "mine" ? "default" : "outline"}
            onClick={() => setFilter("mine")}
            size="sm"
          >
            My Tickets
          </Button>
          <Button
            variant={filter === "assigned" ? "default" : "outline"}
            onClick={() => setFilter("assigned")}
            size="sm"
          >
            All Assigned
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Tickets</CardTitle>
            <CardDescription>
              {filter === "unassigned"
                ? "No unassigned tickets at the moment."
                : filter === "mine"
                ? "You don't have any assigned tickets."
                : filter === "all"
                ? "No open tickets at the moment."
                : "No tickets match the current filter."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setFilter("all")} variant="outline" className="w-full">
              Show All Open Tickets
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{ticket.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span>Customer: {ticket.customer_email}</span>
                      <span>•</span>
                      <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                      {ticket.agent_id && (
                        <>
                          <span>•</span>
                          <span className="text-xs">
                            Assigned: {ticket.agent_id === user.id ? "You" : "Another Agent"}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => setSelectedTicketId(ticket.id)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    Open Chat
                  </Button>

                  {/* Assign Button */}
                  {!ticket.agent_id && (
                    <Button
                      onClick={() => assignTicket(ticket.id)}
                      variant="outline"
                      size="sm"
                      disabled={assigningTicketId === ticket.id}
                      className="min-w-[100px]"
                    >
                      {assigningTicketId === ticket.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Assigning...
                        </>
                      ) : (
                        "Assign to Me"
                      )}
                    </Button>
                  )}

                  {/* Status Action Buttons */}
                  {ticket.agent_id === user.id && (
                    <>
                      {ticket.status === "open" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                        >
                          Start Working
                        </Button>
                      )}

                      {ticket.status === "in_progress" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                        >
                          {updatingTicketId === ticket.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            "Mark Resolved"
                          )}
                        </Button>
                      )}

                      {ticket.status === "resolved" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "closed")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                        >
                          {updatingTicketId === ticket.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Closing...
                            </>
                          ) : (
                            "Close Ticket"
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
