"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import NewTicketForm from "./NewTicketForm";
import ChatInterface from "@/components/shared/ChatInterface";
import TicketRow from "@/app/dashboard/_components/TicketRow";
import { useCustomerTickets } from "@/app/dashboard/_hooks/use-customer-tickets";
import type { CustomerFilter } from "@/lib/tickets/queries";
import FilterTabs, { type FilterTab } from "@/components/shared/FilterTabs";
import TicketSearchInput from "@/components/shared/TicketSearchInput";
import { TicketListSkeleton, TicketListEmpty } from "@/components/shared/TicketListStates";
import { DashboardSidebar, DashboardPanel } from "@/components/shared/DashboardShell";
import { PlusCircle, MessageSquare } from "lucide-react";

interface CustomerDashboardProps {
  user: User;
}

type ViewMode = "list" | "new-ticket";

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CustomerFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { tickets, stats, isLoading, refreshTickets, refreshStats } = useCustomerTickets(
    user.id,
    filter
  );

  const handleTicketCreated = (ticketId: string) => {
    setViewMode("list");
    setSelectedTicketId(ticketId);
    refreshTickets(true);
    refreshStats();
  };

  const filteredTickets = tickets.filter(
    (t) => !search || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: FilterTab<CustomerFilter>[] = [
    { key: "all", label: "All", count: stats.all },
    { key: "open", label: "Open", count: stats.open },
    { key: "active", label: "Active", count: stats.active },
    { key: "resolved", label: "Done", count: stats.resolved },
  ];

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <DashboardSidebar className="w-[300px] flex-shrink-0 flex flex-col border-r border-border bg-card">

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

          <FilterTabs tabs={TABS} active={filter} onChange={setFilter} />
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-border">
          <TicketSearchInput value={search} onChange={setSearch} />
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <TicketListSkeleton rows={5} />
          ) : filteredTickets.length === 0 ? (
            <TicketListEmpty
              message={search ? "No tickets match your search" : "No tickets yet"}
              showClear={!!search || filter !== "all"}
              onClear={() => { setSearch(""); setFilter("all"); }}
            />
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
      </DashboardSidebar>

      {/* Right Panel */}
      <DashboardPanel className="flex-1 overflow-hidden flex flex-col bg-background">
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
      </DashboardPanel>
    </div>
  );
}
