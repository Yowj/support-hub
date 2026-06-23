"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchCustomerStats,
  fetchCustomerTickets,
  type CustomerFilter,
  type CustomerStats,
} from "@/lib/tickets/queries";
import type { Ticket } from "@/types/ticket";

/**
 * Owns the customer dashboard's data: the customer's own tickets, tab stats,
 * and the realtime subscription scoped to their rows.
 */
export function useCustomerTickets(userId: string, filter: CustomerFilter) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<CustomerStats>({ all: 0, open: 0, active: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const refreshStats = useCallback(async () => {
    const next = await fetchCustomerStats(supabase, userId);
    if (next) setStats(next);
  }, [userId, supabase]);

  const refreshTickets = useCallback(
    async (background = false) => {
      if (!background) setIsLoading(true);
      try {
        setTickets(await fetchCustomerTickets(supabase, filter, userId));
      } catch {
        // error already logged in the query layer
      } finally {
        if (!background) setIsLoading(false);
      }
    },
    [filter, userId, supabase]
  );

  useEffect(() => {
    refreshTickets();
    refreshStats();

    const channel = supabase
      .channel("customer-tickets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
          filter: `customer_id=eq.${userId}`,
        },
        () => {
          refreshTickets(true);
          refreshStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, refreshTickets, refreshStats, userId, supabase]);

  return { tickets, stats, isLoading, refreshTickets, refreshStats };
}
