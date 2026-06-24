import type { TicketStatus, TicketPriority } from "@/types/ticket";

/** Tailwind classes for the small priority dot shown on ticket rows. */
export const PRIORITY_DOT: Record<TicketPriority, string> = {
  urgent: "bg-danger",
  high: "bg-warning",
  medium: "bg-info",
  low: "bg-muted-foreground/40",
};

/** Tailwind classes for the status chip shown on ticket rows. */
export const STATUS_CHIP: Record<TicketStatus, string> = {
  open: "bg-danger/15 text-danger",
  in_progress: "bg-warning/15 text-warning",
  resolved: "bg-success/15 text-success",
  closed: "bg-muted text-muted-foreground",
};

/** Decorative gradient backgrounds keyed by status, used for the customer
 *  ticket avatar. These are identity/decoration (not semantic signal), so
 *  they intentionally use the multi-hue palette rather than signal tokens. */
export const STATUS_ICON_BG: Record<TicketStatus, string> = {
  open: "from-red-400 to-rose-500",
  in_progress: "from-amber-400 to-orange-500",
  resolved: "from-emerald-400 to-teal-500",
  closed: "from-muted-foreground/40 to-muted-foreground/60",
};

/** Decorative per-user avatar gradients — identity coloring, not signal. */
const AVATAR_COLORS = [
  "from-indigo-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
];

/** Deterministically pick an avatar gradient from a seed string. */
export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Up-to-two-letter uppercase initials from a name/email. */
export function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

/** Human-friendly "x minutes ago" style relative time. */
export function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Clock time (e.g. "3:04 PM") for a chat message timestamp. */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** "Today" / "Yesterday" / dated label for chat date separators. */
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

/** Border + background classes for the status badge in the chat header. */
export function getStatusStyle(status: string): string {
  switch (status) {
    case "open": return "bg-danger/15 text-danger border-danger/30";
    case "in_progress": return "bg-warning/15 text-warning border-warning/30";
    case "resolved": return "bg-success/15 text-success border-success/30";
    case "closed": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

/** Border + background classes for the priority badge in the chat header. */
export function getPriorityStyle(priority: string): string {
  switch (priority) {
    case "urgent": return "bg-danger/15 text-danger border-danger/30";
    case "high": return "bg-warning/15 text-warning border-warning/30";
    case "medium": return "bg-info/15 text-info border-info/30";
    case "low": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
}
