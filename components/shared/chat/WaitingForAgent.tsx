"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Headset } from "lucide-react";

interface WaitingForAgentProps {
  onClose: () => void;
  /** When the customer started waiting (ticket creation) — keeps the timer
   *  consistent across navigation instead of resetting on each mount. */
  waitingSince: string;
}

// Friendly, rotating reassurance — kept honest (no fake queue numbers / ETAs).
const STATUS_MESSAGES = [
  "Connecting you with a support agent…",
  "Finding the best person to help you…",
  "Hang tight — we're matching you now…",
  "An agent will join this chat shortly…",
  "Thanks for your patience, we're on it…",
];

const MESSAGE_ROTATE_MS = 3200;

/** Whole seconds elapsed since an ISO timestamp, clamped at 0. */
function elapsedSince(iso: string) {
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 1000));
}

function formatElapsed(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hh > 0 ? `${hh}:${pad(mm)}:${pad(ss)}` : `${mm}:${pad(ss)}`;
}

/**
 * Shown to a customer while their ticket is unassigned (no agent yet). Replaces
 * the ChatHeader entirely — there's no one on the other side to show — with an
 * animated "searching" state that keeps the waiting customer engaged.
 */
export default function WaitingForAgent({ onClose, waitingSince }: WaitingForAgentProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  // Derive elapsed from the real start time so it stays consistent if the
  // customer leaves and reopens the chat (no reset to zero).
  const [elapsed, setElapsed] = useState(() => elapsedSince(waitingSince));

  useEffect(() => {
    // Anchor the absolute offset once from the ticket's real start, then count
    // up using a purely local delta. Recomputing `now - created_at` every tick
    // would freeze at 0:00 for a few seconds whenever the device clock lags the
    // DB clock (the difference is briefly negative); local counting avoids that.
    const baseElapsed = elapsedSince(waitingSince);
    const mountedAt = Date.now();
    setElapsed(baseElapsed);

    const rotate = setInterval(
      () => setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length),
      MESSAGE_ROTATE_MS
    );
    const tick = setInterval(
      () => setElapsed(baseElapsed + Math.floor((Date.now() - mountedAt) / 1000)),
      1000
    );
    return () => {
      clearInterval(rotate);
      clearInterval(tick);
    };
  }, [waitingSince]);

  return (
    <div className="relative flex flex-col items-center gap-5 px-6 py-8 bg-card border-b border-border shadow-sm flex-shrink-0 overflow-hidden">
      {/* Soft brand glow behind the orb */}
      <div className="brand-glow pointer-events-none absolute inset-x-0 -top-10 h-40" aria-hidden />

      {/* Escape route — keep customers from feeling trapped while waiting */}
      <button
        onClick={onClose}
        className="absolute left-3 top-3 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Animated "searching" orb: pulse ring + orbiting satellites + breathing core */}
      <div className="relative h-28 w-28" aria-hidden>
        <span className="absolute inset-2 rounded-full animate-pulse-ring" />

        {/* Outer orbit */}
        <div className="absolute inset-0 animate-orbit">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand)/0.7)]" />
        </div>
        {/* Inner counter-orbit */}
        <div className="absolute inset-4 animate-orbit-reverse">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-brand-cyan/90" />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-brand/70" />
        </div>

        {/* Core */}
        <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg animate-breathe">
          <Headset className="h-7 w-7 text-on-brand" />
        </div>
      </div>

      {/* Status copy */}
      <div className="text-center space-y-1.5">
        <p
          key={messageIndex}
          className="text-sm font-semibold text-foreground animate-fade-in"
          aria-live="polite"
        >
          {STATUS_MESSAGES[messageIndex]}
        </p>
        <p className="text-xs text-muted-foreground">
          You can keep typing — your messages are saved and the agent will see
          everything.
        </p>
      </div>

      {/* Indeterminate progress + honest elapsed timer */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 rounded-full bg-brand-gradient animate-indeterminate" />
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-breathe" />
          <span>
            Waiting for an agent ·{" "}
            <span className="tabular-nums">{formatElapsed(elapsed)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
