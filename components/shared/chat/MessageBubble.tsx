import type { Message } from "@/types/ticket";
import { getInitials, formatTime } from "@/lib/tickets/format";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  contactName: string;
}

export default function MessageBubble({ message, isMine, contactName }: MessageBubbleProps) {
  if (message.sender_type === "system") {
    return (
      <div className="flex justify-center py-1">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full italic">
          {message.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0 shadow-sm mb-5">
          <span className="text-on-brand font-semibold text-xs">{getInitials(contactName)}</span>
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
        <span className="text-xs text-muted-foreground px-1">
          {isMine ? "You" : contactName}
        </span>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isMine
              ? "bg-brand-gradient text-on-brand rounded-2xl rounded-br-sm"
              : "bg-card text-foreground border border-border rounded-2xl rounded-bl-sm"
          }`}
        >
          {message.message}
        </div>
        <span className="text-xs text-muted-foreground px-1">{formatTime(message.timestamp)}</span>
      </div>

      {isMine && (
        <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 shadow-sm mb-5">
          <span className="text-background font-semibold text-xs">Me</span>
        </div>
      )}
    </div>
  );
}
