import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  isSending: boolean;
  isClosed: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  isSending,
  isClosed,
  textareaRef,
  onChange,
  onSend,
}: ChatInputProps) {
  if (isClosed) {
    return (
      <div className="px-4 py-3 bg-muted border-t border-border flex-shrink-0">
        <p className="text-center text-sm text-muted-foreground">
          This ticket has been closed and is no longer accepting messages.
        </p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end gap-2 px-4 py-3 bg-card border-t border-border flex-shrink-0">
      <div className="flex-1 flex items-end bg-muted rounded-2xl px-4 py-2 min-h-[44px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Aa"
          rows={1}
          autoFocus
          className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground max-h-[120px] overflow-y-auto leading-relaxed self-center"
        />
      </div>
      <button
        onClick={onSend}
        disabled={isSending || !value.trim()}
        className="w-11 h-11 rounded-full bg-brand hover:bg-brand/90 active:scale-95 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
        aria-label="Send message"
      >
        {isSending ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <Send className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
}
