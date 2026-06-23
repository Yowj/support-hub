"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { MessageSquare } from "lucide-react";
import ChatInterface from "@/components/shared/ChatInterface";
import AgentTicketRow from "@/app/agent/_components/AgentTicketRow";
import { useAgentTickets } from "@/app/agent/_hooks/use-agent-tickets";
import { AnimatePresence } from "framer-motion";
import type { AgentFilter } from "@/lib/tickets/queries";
import FilterTabs, { type FilterTab } from "@/components/shared/FilterTabs";
import TicketSearchInput from "@/components/shared/TicketSearchInput";
import { TicketListSkeleton, TicketListEmpty } from "@/components/shared/TicketListStates";
import { DashboardSidebar, DashboardPanel } from "@/components/shared/DashboardShell";

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

  const TABS: FilterTab<AgentFilter>[] = [
    { key: "all", label: "All", count: stats.all },
    { key: "unassigned", label: "New", count: stats.unassigned },
    { key: "mine", label: "Mine", count: stats.mine },
    { key: "assigned", label: "Active", count: stats.assigned },
  ];

  return (
    <div className="flex h-full">
      {/* ── Left Sidebar ── */}
      <DashboardSidebar className="w-[300px] flex-shrink-0 flex flex-col border-r border-border bg-card">

        {/* Sidebar Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Support Queue</h2>
            <span className="text-xs text-muted-foreground">{stats.all} open</span>
          </div>

          <FilterTabs tabs={TABS} active={filter} onChange={setFilter} />
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-border">
          <TicketSearchInput value={search} onChange={setSearch} />
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <TicketListSkeleton rows={6} />
          ) : filteredTickets.length === 0 ? (
            <TicketListEmpty
              message={search ? "No tickets match your search" : "No tickets here"}
              showClear={!!search || filter !== "all"}
              onClear={() => { setSearch(""); setFilter("all"); }}
            />
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
      </DashboardSidebar>

      {/* ── Right Panel ── */}
      <DashboardPanel className="flex-1 overflow-hidden flex flex-col bg-background">
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
      </DashboardPanel>
    </div>
  );
}
