import type { Message } from "@/types/ticket";
import { formatDate } from "@/lib/tickets/format";

export interface MessageGroup {
  date: string;
  messages: Message[];
}

/** Group consecutive messages under their formatted calendar date for separators. */
export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
  });
  return groups;
}
