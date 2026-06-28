import type { Message } from "@/types/ticket";
import { formatSeparator } from "@/lib/tickets/format";

/** Messages closer together than this are treated as one consecutive "run"
 *  (Messenger-style), so the name/avatar only show once per run. */
const RUN_GAP_MS = 5 * 60 * 1000;

/** When the gap since the previous message exceeds this, a centered time
 *  separator is inserted to mark that the conversation resumed. */
const SEPARATOR_GAP_MS = 30 * 60 * 1000;

export interface SeparatorRow {
  kind: "separator";
  id: string;
  label: string;
}

export interface MessageRow {
  kind: "message";
  message: Message;
  /** First message of a consecutive run — shows the sender name. */
  isFirstInRun: boolean;
  /** Last message of a consecutive run — shows the avatar. */
  isLastInRun: boolean;
}

export type ChatRow = SeparatorRow | MessageRow;

function gapMs(a: Message, b: Message): number {
  return Math.abs(new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Two messages belong to the same run when they share a sender and are sent
 *  within RUN_GAP_MS of each other. System messages never join a run. */
function sameRun(a: Message, b: Message): boolean {
  if (a.sender_type === "system" || b.sender_type === "system") return false;
  if (a.sender_id !== b.sender_id) return false;
  return gapMs(a, b) <= RUN_GAP_MS;
}

// used in MessageList.tsx to lay out messages with time separators and runs
export function buildChatRows(messages: Message[]): ChatRow[] {
  const rows: ChatRow[] = [];

  messages.forEach((message, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];

    // A separator marks the conversation start, or a resume after a long gap.
    if (!prev || gapMs(prev, message) > SEPARATOR_GAP_MS) {
      rows.push({
        kind: "separator",
        id: `sep-${message.id}`,
        label: formatSeparator(message.timestamp),
      });
    }

    rows.push({
      kind: "message",
      message,
      isFirstInRun: !prev || !sameRun(prev, message),
      isLastInRun: !next || !sameRun(message, next),
    });
  });

  return rows;
}
