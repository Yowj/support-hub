"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Search, Inbox, UserCheck, Users, AlertTriangle, MessageSquare } from "lucide-react";
import ChatInterface from "./chat-interface";
import AgentTicketRow from "@/app/agent/_components/AgentTicketRow";
import { useAgentTickets } from "@/app/agent/_hooks/use-agent-tickets";
import { AnimatePresence } from "framer-motion";
import type { AgentFilter } from "@/lib/tickets/queries";

interface AgentDashboardProps {
  user: User;
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AgentFilter>("all");
  const [search, setSearch] = useState("");

  const {
    tickets,
    stats,
    isLoading,
    assigningTicketId,
    updatingTicketId,
    assignTicket,
    updateTicketStatus,
  } = useAgentTickets(user, filter);

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
            <AnimatePresence initial={false}>
              {filteredTickets.map((ticket) => (
                <AgentTicketRow
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTicketId === ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  onAssign={() => assignTicket(ticket.id)}
                  onStatusUpdate={(status) => updateTicketStatus(ticket.id, status)}
                  isAssigning={assigningTicketId === ticket.id}
                  isUpdating={updatingTicketId === ticket.id}
                  userId={user.id}
                />
              ))}
            </AnimatePresence>
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
