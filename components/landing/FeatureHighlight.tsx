import { Check } from "lucide-react";
import Eyebrow from "./Eyebrow";

const checklist = [
  "Unified timeline across every channel",
  "Customer history and order data inline",
  "Internal notes and @mentions for the team",
];

const rows = [
  { tag: "CHAT", text: "Where is my order #4821?", time: "now" },
  { tag: "EMAIL", text: "Re: Refund request", time: "2m" },
  { tag: "AI DRAFT", text: "Your order shipped this morning…", time: "2m" },
];

export default function FeatureHighlight() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>One shared inbox</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
              Every conversation,{" "}
              <span className="font-serif italic font-normal text-brand-gradient">
                in one place
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chat, email, and social messages land in a single timeline with
              full customer context beside each thread. No tab-switching, no
              copy-pasting history — just reply and move on.
            </p>
            <ul className="mt-7 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <Check className="h-3 w-3 text-brand" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stacked clip-style cards */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 brand-glow opacity-60" />
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm ${
                    i === 2 ? "ring-1 ring-brand/40 animate-pulse-ring" : ""
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wide ${
                      i === 2 ? "text-brand" : "text-muted-foreground"
                    }`}
                  >
                    {row.tag}
                  </span>
                  <span className="flex-1 truncate text-sm">{row.text}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
