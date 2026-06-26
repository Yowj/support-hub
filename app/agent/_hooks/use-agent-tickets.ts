"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAgentStats,
  fetchAgentTickets,
  assignTicket as assignTicketQuery,
  updateTicketStatus as updateTicketStatusQuery,
  TICKETS_BROADCAST_CHANNEL,
  type AgentFilter,
  type AgentStats,
} from "@/lib/tickets/queries";
import type { Ticket } from "@/types/ticket";

interface AgentUser {
  id: string;
  email?: string;
}

export function useAgentTickets(user: AgentUser, filter: AgentFilter) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<AgentStats>({ all: 0, unassigned: 0, mine: 0, assigned: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const supabase = createClient();

  const refreshStats = useCallback(async () => {
    const next = await fetchAgentStats(supabase, user.id);
    if (next) setStats(next);
  }, [user.id, supabase]);

  // Initial / filter-change load: shows the loading state.
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      setTickets(await fetchAgentTickets(supabase, filter, user.id));
    } catch {
      // error already logged in the query layer
    } finally {
      setIsLoading(false);
    }
  }, [filter, user.id, supabase]);

  // Silent refresh used by realtime/after-action updates: no loading flicker.
  const syncTickets = useCallback(async () => {
    try {
      setTickets(await fetchAgentTickets(supabase, filter, user.id));
    } catch {
      // error already logged in the query layer
    }
  }, [filter, user.id, supabase]);

  useEffect(() => {
    loadTickets();
    refreshStats();

    // Both listeners do the same thing: re-fetch the queue and tab counts.
    const refreshQueue = () => {
      syncTickets();
      refreshStats();
    };

    // Listener 1: native DB events — reliable for UPDATE/DELETE on tickets.
    const dbChangesListener = supabase
      .channel("agent-tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        refreshQueue
      )
      .subscribe();

    // Listener 2: manual broadcast — catches new tickets that RLS hides from
    // the DB INSERT event (customer fires "ticket-created" after creating one).
    // ! Note: this is a temporary workaround, u need RLS-based na broadcast
    const newTicketListener = supabase
      .channel(TICKETS_BROADCAST_CHANNEL)
      .on("broadcast", { event: "ticket-created" }, refreshQueue)
      .subscribe();

    return () => {
      supabase.removeChannel(dbChangesListener);
      supabase.removeChannel(newTicketListener);
    };
  }, [filter, loadTickets, syncTickets, refreshStats, supabase]);

  const assignTicket = async (ticketId: string) => {
    setAssigningTicketId(ticketId);
    try {
      await assignTicketQuery(supabase, ticketId, user);
      await Promise.all([syncTickets(), refreshStats()]);
    } catch (error) {
      console.error("Error assigning ticket:", error);
    } finally {
      setAssigningTicketId(null);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    setUpdatingTicketId(ticketId);
    try {
      await updateTicketStatusQuery(supabase, ticketId, status, user.id);
      await Promise.all([syncTickets(), refreshStats()]);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return {
    tickets,
    stats,
    isLoading,
    assigningTicketId,
    updatingTicketId,
    assignTicket,
    updateTicketStatus,
  };
}
