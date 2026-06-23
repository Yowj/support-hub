import { ArrowLeft } from "lucide-react";
import type { Ticket } from "@/types/ticket";
import { getInitials, getStatusStyle, getPriorityStyle } from "@/lib/tickets/format";

interface ChatHeaderProps {
  contactName: string;
  ticket: Ticket | null;
  onClose: () => void;
}

export default function ChatHeader({ contactName, ticket, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shadow-sm flex-shrink-0">
      <button
        onClick={onClose}
        className="p-2 -ml-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Contact avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm">
          <span className="text-white font-semibold text-sm">{getInitials(contactName)}</span>
        </div>
        {ticket?.status !== "closed" && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
        )}
      </div>

      {/* Contact info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-foreground">{contactName}</div>
        <div className="text-xs text-muted-foreground truncate">{ticket?.subject}</div>
      </div>

      {/* Status & priority badges */}
      {ticket && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getStatusStyle(ticket.status)}`}
          >
            {ticket.status.replace("_", " ")}
          </span>
          <span
            className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getPriorityStyle(ticket.priority)}`}
          >
            {ticket.priority}
          </span>
        </div>
      )}
    </div>
  );
}
