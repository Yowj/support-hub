"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Hash } from "lucide-react";
import { PRIORITY_DOT, STATUS_CHIP, STATUS_ICON_BG, getRelativeTime } from "@/lib/tickets/format";
import type { Ticket } from "@/types/ticket";

interface TicketRowProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

/** Staggered entrance — each row slides in slightly after the one above it.
 *  Scoped to enter only so exits, reordering, and the update flash stay snappy. */
const enterVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut", delay: Math.min(i * 0.04, 0.4) },
  }),
};

const TicketRow = React.memo(function TicketRow({ ticket, isSelected, onClick, index }: TicketRowProps) {
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
      custom={index}
      variants={enterVariants}
      initial="hidden"
      animate="visible"
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
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${STATUS_ICON_BG[ticket.status] || "from-muted-foreground/40 to-muted-foreground/60"} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <Hash className="h-3.5 w-3.5 text-on-brand" />
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
    </motion.div>
  );
});

export default TicketRow;
