"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewTicketForm from "./new-ticket-form";
import ChatInterface from "./chat-interface";
import type { User } from "@supabase/supabase-js";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
}

interface CustomerDashboardProps {
  user: User;
}

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Use useCallback to memoize the fetchTickets function
  const fetchTickets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user.id, supabase]);

  useEffect(() => {
    fetchTickets();

    // Set up real-time subscription for ticket updates
    const channel = supabase
      .channel('customer-tickets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
          filter: `customer_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Ticket update received:', payload);
          // Refresh tickets when any change occurs
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTickets, user.id, supabase]);

  const handleTicketCreated = (ticketId: string) => {
    setShowNewTicketForm(false);
    setSelectedTicketId(ticketId);
    fetchTickets();
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

  if (selectedTicketId) {
    return (
      <ChatInterface
        ticketId={selectedTicketId}
        userId={user.id}
        userRole="customer"
        onClose={() => setSelectedTicketId(null)}
      />
    );
  }

  if (showNewTicketForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowNewTicketForm(false)}
        >
          ← Back to Tickets
        </Button>
        <NewTicketForm
          userId={user.id}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-gray-600">Manage your support requests</p>
        </div>
        <Button onClick={() => setShowNewTicketForm(true)}>
          Create New Ticket
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={() => fetchTickets()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading tickets...</div>
          </CardContent>
        </Card>
      ) : !error && tickets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Support Tickets</CardTitle>
            <CardDescription>
              You haven&apos;t created any support tickets yet. Click &quot;Create New Ticket&quot; to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : !error ? (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicketId(ticket.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <CardDescription>
                      Created {new Date(ticket.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}