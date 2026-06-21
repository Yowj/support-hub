"use client";

import { createClient } from "@/lib/supabase/client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import NewTicketForm from "./new-ticket-form";
import ChatInterface from "./chat-interface";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Inbox,
  Clock,
  CheckCircle,
  PlusCircle,
  MessageSquare,
  Hash,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
}

interface Stats {
  all: number;
  open: number;
  active: number;
  resolved: number;
}

interface CustomerDashboardProps {
  user: User;
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-blue-400",
  low: "bg-muted-foreground/40",
};

const STATUS_CHIP: Record<string, string> = {
  open: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed: "bg-muted text-muted-foreground",
};

const STATUS_ICON_BG: Record<string, string> = {
  open: "from-red-400 to-rose-500",
  in_progress: "from-amber-400 to-orange-500",
  resolved: "from-emerald-400 to-teal-500",
  closed: "from-gray-300 to-gray-400",
};

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
}

type ViewMode = "list" | "new-ticket";

interface TicketRowProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

const TicketRow = React.memo(function TicketRow({ ticket, isSelected, onClick }: TicketRowProps) {
  const flashControls = useAnimationControls();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    flashControls.start({
      backgroundColor: ["rgba(59,130,246,0.15)", "rgba(59,130,246,0)"],
      transition: { duration: 1.2, ease: "easeOut" },
    });
  }, [ticket.updated_at, flashControls]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
      onClick={onClick}
      className={`group relative flex items-start gap-2.5 px-3 py-3 cursor-pointer border-l-2 transition-colors ${
        isSelected ? "bg-accent border-l-primary" : "border-l-transparent hover:bg-accent/50"
      }`}
    >
      <motion.div className="absolute inset-0 pointer-events-none" animate={flashControls} />
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${STATUS_ICON_BG[ticket.status] || "from-gray-300 to-gray-400"} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <Hash className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-0.5">
          <span className="text-xs font-medium truncate block text-foreground">
            {ticket.subject}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize ${
              STATUS_CHIP[ticket.status] || "bg-muted text-muted-foreground"
            }`}
          >
            {ticket.status.replace("_", " ")}
          </span>
          <span className="text-xs text-muted-foreground">{getRelativeTime(ticket.created_at)}</span>
        </div>
      </div>
      <div
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
          PRIORITY_DOT[ticket.priority] || "bg-gray-300"
        }`}
        title={`Priority: ${ticket.priority}`}
      />
    </motion.div>
  );
});

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ all: 0, open: 0, active: 0, resolved: 0 });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "active" | "resolved">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    const { data } = await supabase
      .from("support_tickets")
      .select("status")
      .eq("customer_id", user.id);
    if (!data) return;
    setStats({
      all: data.length,
      open: data.filter((t) => t.status === "open").length,
      active: data.filter((t) => t.status === "in_progress").length,
      resolved: data.filter((t) => t.status === "resolved" || t.status === "closed").length,
    });
  }, [user.id, supabase]);

  const fetchTickets = useCallback(async (background = false) => {
    if (!background) setIsLoading(true);
    try {
      let query = supabase
        .from("support_tickets")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      switch (filter) {
        case "open":
          query = query.eq("status", "open");
          break;
        case "active":
          query = query.eq("status", "in_progress");
          break;
        case "resolved":
          query = query.in("status", ["resolved", "closed"]);
          break;
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      if (!background) setIsLoading(false);
    }
  }, [filter, user.id, supabase]);

  useEffect(() => {
    fetchTickets();
    fetchStats();

    const channel = supabase
      .channel("customer-tickets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          fetchTickets(true);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, fetchTickets, fetchStats, user.id, supabase]);

  const handleTicketCreated = (ticketId: string) => {
    setViewMode("list");
    setSelectedTicketId(ticketId);
    fetchTickets(true);
    fetchStats();
  };

  const filteredTickets = tickets.filter(
    (t) => !search || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key: "all" as const, label: "All", count: stats.all, icon: Inbox },
    { key: "open" as const, label: "Open", count: stats.open, icon: Clock },
    { key: "active" as const, label: "Active", count: stats.active, icon: MessageSquare },
    { key: "resolved" as const, label: "Done", count: stats.resolved, icon: CheckCircle },
  ];

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-[300px] flex-shrink-0 flex flex-col border-r border-border bg-card">

        {/* Sidebar Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">My Tickets</h2>
            <Button
              size="sm"
              onClick={() => { setViewMode("new-ticket"); setSelectedTicketId(null); }}
              className="h-6 text-[11px] px-2"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              New
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {TABS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className={`text-base font-bold leading-none mb-0.5 ${filter === key ? "text-primary-foreground" : "text-foreground"}`}>
                  {count}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-px pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-3">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-muted/50 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <p className="text-xs text-muted-foreground">
                {search ? "No tickets match your search" : "No tickets yet"}
              </p>
              {(search || filter !== "all") && (
                <button
                  onClick={() => { setSearch(""); setFilter("all"); }}
                  className="mt-2 text-xs text-primary hover:text-primary/80"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredTickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTicketId === ticket.id && viewMode === "list"}
                  onClick={() => { setSelectedTicketId(ticket.id); setViewMode("list"); }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {viewMode === "new-ticket" ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  ← Back
                </Button>
                <h2 className="text-lg font-semibold text-foreground">New Support Ticket</h2>
              </div>
              <NewTicketForm userId={user.id} onTicketCreated={handleTicketCreated} />
            </div>
          </div>
        ) : selectedTicketId ? (
          <ChatInterface
            key={selectedTicketId}
            ticketId={selectedTicketId}
            userId={user.id}
            userRole="customer"
            onClose={() => setSelectedTicketId(null)}
            className="flex flex-col h-full bg-background overflow-hidden"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No ticket selected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select a ticket from the list or create a new one
            </p>
            <Button
              onClick={() => setViewMode("new-ticket")}
              className="mt-4"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
