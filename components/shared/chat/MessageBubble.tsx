import type { Message } from "@/types/ticket";
import Avatar from "boring-avatars";
import { formatTime } from "@/lib/tickets/format";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  contactName: string;
  /** First of a consecutive run — shows the sender name. */
  isFirstInRun?: boolean;
  /** Last of a consecutive run — shows the avatar. */
  isLastInRun?: boolean;
}

export default function MessageBubble({
  message,
  isMine,
  contactName,
  isFirstInRun = true,
  isLastInRun = true,
}: MessageBubbleProps) {
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
    <div
      className={`flex items-end gap-2 ${isLastInRun ? "mb-3" : "mb-0.5"} ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!isMine &&
        (isLastInRun ? (
          <div className="flex-shrink-0">
            <Avatar name={contactName} size={28} />
          </div>
        ) : (
          <div className="w-7 flex-shrink-0" aria-hidden />
        ))}

      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
        {isFirstInRun && (
          <span className="text-xs text-muted-foreground px-1">
            {isMine ? "You" : contactName}
          </span>
        )}
        <div className="group/msg relative">
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              isMine
                ? "bg-brand-gradient text-on-brand rounded-2xl rounded-br-sm"
                : "bg-card text-foreground border border-border rounded-2xl rounded-bl-sm"
            }`}
          >
            {message.message}
          </div>
          {/* Exact time, revealed on hover (Messenger-style). */}
          <span
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity duration-150 group-hover/msg:opacity-100 ${
              isMine ? "right-full mr-2" : "left-full ml-2"
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>

      {isMine &&
        (isLastInRun ? (
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-background font-semibold text-xs">Me</span>
          </div>
        ) : (
          <div className="w-7 flex-shrink-0" aria-hidden />
        ))}
    </div>
  );
}
