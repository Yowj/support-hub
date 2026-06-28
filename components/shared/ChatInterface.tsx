"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useChat } from "@/components/shared/chat/use-chat";
import ChatHeader from "@/components/shared/chat/ChatHeader";
import WaitingForAgent from "@/components/shared/chat/WaitingForAgent";
import MessageList from "@/components/shared/chat/MessageList";
import ChatInput from "@/components/shared/chat/ChatInput";

interface ChatInterfaceProps {
  ticketId: string;
  userId: string;
  userRole: "customer" | "agent";
  onClose: () => void;
  className?: string;
}

export default function ChatInterface({
  ticketId,
  userId,
  userRole,
  onClose,
  className,
}: ChatInterfaceProps) {
  const {
    ticket,
    contactName,
    messages,
    newMessage,
    isLoading,
    isSending,
    isOtherTyping,
    error,
    textareaRef,
    setError,
    handleTextareaChange,
    sendMessage,
  } = useChat(ticketId, userId, userRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Unable to load chat</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No agent assigned yet: from the customer's side there's no one on the other
  // end to show, so we drop the ChatHeader and surface an animated waiting state.
  const isWaitingForAgent =
    userRole === "customer" && !ticket?.agent_id && ticket?.status !== "closed";

  return (
    <div
      className={
        className ??
        "flex flex-col h-[calc(100vh-90px)] bg-muted rounded-xl overflow-hidden border border-border shadow-sm"
      }
    >
      {isWaitingForAgent ? (
        <WaitingForAgent onClose={onClose} waitingSince={ticket!.created_at} />
      ) : (
        <ChatHeader contactName={contactName} ticket={ticket} onClose={onClose} />
      )}

      <MessageList
        messages={messages}
        userId={userId}
        contactName={contactName}
        isOtherTyping={isOtherTyping}
      />

      {/* Error banner (non-fatal send/load errors) */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex-shrink-0">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <span className="text-xs text-destructive flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-destructive/70 hover:text-destructive font-bold text-base leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <ChatInput
        value={newMessage}
        isSending={isSending}
        isClosed={ticket?.status === "closed"}
        textareaRef={textareaRef}
        onChange={handleTextareaChange}
        onSend={sendMessage}
      />
    </div>
  );
}
