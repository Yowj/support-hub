import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import type { Message } from "@/types/ticket";
import { buildChatRows } from "@/lib/tickets/group-messages";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  userId: string;
  contactName: string;
  isOtherTyping?: boolean;
}

export default function MessageList({
  messages,
  userId,
  contactName,
  isOtherTyping = false,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 text-lg">No messages yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Start the conversation! Your {contactName.toLowerCase()} will be notified when you send a
            message.
          </p>
        </div>
      ) : (
        buildChatRows(messages).map((row) =>
          row.kind === "separator" ? (
            <div key={row.id} className="flex justify-center py-4">
              <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
            </div>
          ) : (
            <MessageBubble
              key={row.message.id}
              message={row.message}
              isMine={row.message.sender_id === userId}
              contactName={contactName}
              isFirstInRun={row.isFirstInRun}
              isLastInRun={row.isLastInRun}
            />
          )
        )
      )}
      {isOtherTyping && <TypingIndicator contactName={contactName} />}
      <div ref={endRef} />
    </div>
  );
}
