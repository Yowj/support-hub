import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import type { Message } from "@/types/ticket";
import { groupMessagesByDate } from "@/lib/tickets/group-messages";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  userId: string;
  contactName: string;
}

export default function MessageList({ messages, userId, contactName }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
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
        groupMessagesByDate(messages).map((group) => (
          <div key={group.date} className="space-y-1">
            {/* Date separator */}
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-card rounded-full border border-border whitespace-nowrap">
                {group.date}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMine={message.sender_id === userId}
                contactName={contactName}
              />
            ))}
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  );
}
