"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PRIORITY_DOT, STATUS_CHIP, getRelativeTime } from "@/lib/tickets/format";
import Avatar from "boring-avatars";
import type { Ticket } from "@/types/ticket";

interface AgentTicketRowProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
  onAssign: () => void;
  onStatusUpdate: (status: string) => void;
  isAssigning: boolean;
  isUpdating: boolean;
  userId: string;
}

const AgentTicketRow = React.memo(function AgentTicketRow({
  ticket,
  isSelected,
  onClick,
  onAssign,
  onStatusUpdate,
  isAssigning,
  isUpdating,
  userId,
}: AgentTicketRowProps) {
  const flashControls = useAnimationControls();
  const isFirstRender = useRef(true);
  const shouldReduceMotion = useReducedMotion();
  const isUrgent = ticket.priority === "urgent";

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
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`group relative flex items-start gap-2.5 px-3 py-3 cursor-pointer border-l-2 transition-colors ${
        isSelected ? "bg-accent border-l-primary" : "border-l-transparent hover:bg-accent/50"
      }`}
    >
      <motion.div className="absolute inset-0 pointer-events-none" animate={flashControls} />

      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar name={ticket.customer_email || ticket.id} size={32} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          {ticket.priority === "urgent" && (
            <AlertTriangle className="h-3 w-3 text-danger flex-shrink-0" />
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

      {/* Priority dot — urgent tickets pulse a danger ripple to pull triage focus */}
      <motion.div
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
          PRIORITY_DOT[ticket.priority] || "bg-muted-foreground/40"
        }`}
        animate={
          isUrgent && !shouldReduceMotion
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(250,112,112,0.5)",
                  "0 0 0 5px rgba(250,112,112,0)",
                ],
              }
            : undefined
        }
        transition={
          isUrgent && !shouldReduceMotion
            ? { duration: 1.6, ease: "easeOut", repeat: Infinity }
            : undefined
        }
        title={`Priority: ${ticket.priority}`}
      />

      {/* Hover actions */}
      <div
        className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {!ticket.agent_id && (
          <Button
            onClick={onAssign}
            variant="outline"
            size="sm"
            disabled={isAssigning}
            className="h-6 text-[11px] px-2 bg-card"
          >
            {isAssigning ? <Loader2 className="h-3 w-3 animate-spin" /> : "Assign"}
          </Button>
        )}
        {ticket.agent_id === userId && ticket.status === "open" && (
          <Button
            onClick={() => onStatusUpdate("in_progress")}
            variant="outline"
            size="sm"
            disabled={isUpdating}
            className="h-6 text-[11px] px-2 bg-card"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Start"}
          </Button>
        )}
        {ticket.agent_id === userId && ticket.status === "in_progress" && (
          <Button
            onClick={() => onStatusUpdate("resolved")}
            variant="outline"
            size="sm"
            disabled={isUpdating}
            className="h-6 text-[11px] px-2 bg-success/15 text-success border-success/30 hover:bg-success/25"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resolve"}
          </Button>
        )}
        {ticket.agent_id === userId && ticket.status === "resolved" && (
          <Button
            onClick={() => onStatusUpdate("closed")}
            variant="outline"
            size="sm"
            disabled={isUpdating}
            className="h-6 text-[11px] px-2 bg-card"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Close"}
          </Button>
        )}
      </div>
    </motion.div>
  );
});

export default AgentTicketRow;
