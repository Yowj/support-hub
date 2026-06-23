import type { TicketStatus, TicketPriority } from "@/types/ticket";

/** Tailwind classes for the small priority dot shown on ticket rows. */
export const PRIORITY_DOT: Record<TicketPriority, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-blue-400",
  low: "bg-muted-foreground/40",
};

/** Tailwind classes for the status chip shown on ticket rows. */
export const STATUS_CHIP: Record<TicketStatus, string> = {
  open: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed: "bg-muted text-muted-foreground",
};

/** Gradient backgrounds keyed by status, used for the customer ticket avatar. */
export const STATUS_ICON_BG: Record<TicketStatus, string> = {
  open: "from-red-400 to-rose-500",
  in_progress: "from-amber-400 to-orange-500",
  resolved: "from-emerald-400 to-teal-500",
  closed: "from-gray-300 to-gray-400",
};

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
    case "open": return "bg-red-100 text-red-700 border-red-200";
    case "in_progress": return "bg-amber-100 text-amber-700 border-amber-200";
    case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "closed": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

/** Border + background classes for the priority badge in the chat header. */
export function getPriorityStyle(priority: string): string {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-700 border-red-200";
    case "high": return "bg-orange-100 text-orange-700 border-orange-200";
    case "medium": return "bg-blue-100 text-blue-700 border-blue-200";
    case "low": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}
