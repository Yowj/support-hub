"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ChatInterface from "./chat-interface";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Inbox,
  UserCheck,
  Users,
  AlertTriangle,
  MessageSquare,
  Loader2,
} from "lucide-react";

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

interface Stats {
  all: number;
  unassigned: number;
  mine: number;
  assigned: number;
}

interface AgentDashboardProps {
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

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

const AVATAR_COLORS = [
  "from-indigo-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
];

function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ all: 0, unassigned: 0, mine: 0, assigned: 0 });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unassigned" | "assigned" | "mine">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    const { data } = await supabase
      .from("support_tickets")
      .select("agent_id")
      .neq("status", "closed");
    if (!data) return;
    setStats({
      all: data.length,
      unassigned: data.filter((t) => !t.agent_id).length,
      mine: data.filter((t) => t.agent_id === user.id).length,
      assigned: data.filter((t) => t.agent_id !== null).length,
    });
  }, [user.id, supabase]);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("support_tickets")
        .select(
          `*,
          customer:user_profiles!customer_id (
            id,
            display_name,
            avatar_url
          )`
        )
        .neq("status", "closed")
        .order("created_at", { ascending: false });

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
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching tickets:", error.message, error.code);
        return;
      }

      setTickets(
        (data || []).map((ticket) => ({
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
          customer_id: ticket.customer_id,
          agent_id: ticket.agent_id,
          customer_email: ticket.customer?.display_name || "Unknown Customer",
        }))
      );
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, user.id, supabase]);

  useEffect(() => {
    fetchTickets();
    fetchStats();

    const channel = supabase
      .channel("agent-tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => {
          fetchTickets();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, fetchTickets, fetchStats, supabase]);

  const assignTicket = async (ticketId: string) => {
    setAssigningTicketId(ticketId);
    try {
      const { error: updateError } = await supabase
        .from("support_tickets")
        .update({ agent_id: user.id, status: "in_progress" })
        .eq("id", ticketId);
      if (updateError) throw updateError;

      await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: user.id,
          sender_type: "system",
          message: `Agent ${user.email} has been assigned to this ticket.`,
        },
      ]);

      await Promise.all([fetchTickets(), fetchStats()]);
    } catch (error) {
      console.error("Error assigning ticket:", error);
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

      await supabase.from("chat_messages").insert([
        {
          ticket_id: ticketId,
          sender_id: user.id,
          sender_type: "system",
          message: `Ticket status changed to ${status}.`,
        },
      ]);

      await Promise.all([fetchTickets(), fetchStats()]);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_email || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  const TABS = [
    { key: "all" as const, label: "All", count: stats.all, icon: Inbox },
    { key: "unassigned" as const, label: "New", count: stats.unassigned, icon: AlertTriangle },
    { key: "mine" as const, label: "Mine", count: stats.mine, icon: UserCheck },
    { key: "assigned" as const, label: "Active", count: stats.assigned, icon: Users },
  ];

  return (
    <div className="flex h-full">
      {/* ── Left Sidebar ── */}
      <div className="w-[300px] flex-shrink-0 flex flex-col border-r border-border bg-card">

        {/* Sidebar Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Support Queue</h2>
            <span className="text-xs text-muted-foreground">{stats.all} open</span>
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
              {Array.from({ length: 6 }).map((_, i) => (
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
                {search ? "No tickets match your search" : "No tickets here"}
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
            <div>
              {filteredTickets.map((ticket) => {
                const isSelected = selectedTicketId === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`group relative flex items-start gap-2.5 px-3 py-3 cursor-pointer border-l-2 transition-colors ${
                      isSelected
                        ? "bg-accent border-l-primary"
                        : "border-l-transparent hover:bg-accent/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor(
                        ticket.customer_email || ticket.id
                      )} flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <span className="text-white font-semibold text-xs">
                        {getInitials(ticket.customer_email || "?")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        {ticket.priority === "urgent" && (
                          <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium truncate text-foreground">
                          {ticket.subject}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {ticket.customer_email}
                      </p>
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

                    {/* Priority dot */}
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                        PRIORITY_DOT[ticket.priority] || "bg-gray-300"
                      }`}
                      title={`Priority: ${ticket.priority}`}
                    />

                    {/* Hover actions */}
                    <div
                      className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!ticket.agent_id && (
                        <Button
                          onClick={() => assignTicket(ticket.id)}
                          variant="outline"
                          size="sm"
                          disabled={assigningTicketId === ticket.id}
                          className="h-6 text-[11px] px-2 bg-card"
                        >
                          {assigningTicketId === ticket.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Assign"
                          )}
                        </Button>
                      )}
                      {ticket.agent_id === user.id && ticket.status === "open" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                          className="h-6 text-[11px] px-2 bg-card"
                        >
                          {updatingTicketId === ticket.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Start"}
                        </Button>
                      )}
                      {ticket.agent_id === user.id && ticket.status === "in_progress" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                          className="h-6 text-[11px] px-2 bg-white dark:bg-gray-800 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          {updatingTicketId === ticket.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resolve"}
                        </Button>
                      )}
                      {ticket.agent_id === user.id && ticket.status === "resolved" && (
                        <Button
                          onClick={() => updateTicketStatus(ticket.id, "closed")}
                          variant="outline"
                          size="sm"
                          disabled={updatingTicketId === ticket.id}
                          className="h-6 text-[11px] px-2 bg-card"
                        >
                          {updatingTicketId === ticket.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Close"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {selectedTicketId && selectedTicket ? (
          <ChatInterface
            key={selectedTicketId}
            ticketId={selectedTicketId}
            userId={user.id}
            userRole="agent"
            onClose={() => setSelectedTicketId(null)}
            className="flex flex-col h-full bg-background overflow-hidden"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No conversation open</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select a ticket from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
