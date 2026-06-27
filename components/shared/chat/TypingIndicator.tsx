import Avatar from "boring-avatars";

interface TypingIndicatorProps {
  contactName: string;
}

/** Animated "…" bubble shown while the other party is typing. */
export default function TypingIndicator({ contactName }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 mb-1 justify-start" aria-live="polite">
      <div className="flex-shrink-0 mb-1">
        <Avatar name={contactName} size={28} />
      </div>

      <div className="flex flex-col gap-0.5 items-start">
        <span className="text-xs text-muted-foreground px-1">{contactName}</span>
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-2xl rounded-bl-sm shadow-sm">
          <span className="text-xs text-muted-foreground">{contactName} is typing</span>
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
