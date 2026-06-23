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

/**
 * Owns the agent queue's data: ticket list, tab stats, realtime updates, and
 * the assign/status mutations. Keeps the dashboard component presentational.
 */
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

  const refreshTickets = useCallback(
    async (background = false) => {
      if (!background) setIsLoading(true);
      try {
        setTickets(await fetchAgentTickets(supabase, filter, user.id));
      } catch {
        // error already logged in the query layer
      } finally {
        if (!background) setIsLoading(false);
      }
    },
    [filter, user.id, supabase]
  );

  useEffect(() => {
    refreshTickets();
    refreshStats();

    const channel = supabase
      .channel("agent-tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => {
          refreshTickets(true);
          refreshStats();
        }
      )
      .subscribe();

    // Secondary listener for new tickets created by customers.
    // postgres_changes (above) handles UPDATE/DELETE reliably, but INSERT events
    // from other users are blocked by Supabase Realtime's RLS evaluation on
    // complex cross-table policies. The customer broadcasts on this channel after
    // creating a ticket, and we pick it up here to trigger a fresh fetch.
    const broadcastChannel = supabase
      .channel(TICKETS_BROADCAST_CHANNEL)
      .on("broadcast", { event: "ticket-created" }, () => {
        refreshTickets(true);
        refreshStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(broadcastChannel);
    };
  }, [filter, refreshTickets, refreshStats, supabase]);

  const assignTicket = async (ticketId: string) => {
    setAssigningTicketId(ticketId);
    try {
      await assignTicketQuery(supabase, ticketId, user);
      await Promise.all([refreshTickets(true), refreshStats()]);
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
      await Promise.all([refreshTickets(true), refreshStats()]);
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
