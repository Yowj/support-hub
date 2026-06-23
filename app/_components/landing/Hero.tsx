import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Ambient brand glow + dotted texture */}
      <div className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] brand-glow" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Now with AI-powered replies
            </span>
          </div>

          <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] animate-fade-in-up">
            Customer support that{" "}
            <span className="font-serif italic font-normal text-brand-gradient animate-gradient-pan">
              actually
            </span>{" "}
            works
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
            The modern platform for teams that care about their customers.
            Real-time chat, smart routing, and analytics that actually move the
            needle — all in one place.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animation-delay-400">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-7 text-base gap-2 bg-brand-gradient text-white border-0 shadow-lg shadow-brand/25 hover:opacity-95 hover:shadow-brand/40 transition"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-7 text-base">
              Watch demo
            </Button>
          </div>

          <p className="mt-5 font-mono text-xs text-muted-foreground animate-fade-in-up animation-delay-400">
            Free 14-day trial · No credit card required
          </p>
        </div>

        {/* App-window mockup */}
        <div className="relative mt-16 lg:mt-20 animate-fade-in-up animation-delay-600">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-brand/10 ring-1 ring-black/5">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-md bg-background/60 px-4 py-1 font-mono text-xs text-muted-foreground">
                    app.supporthub.io
                  </div>
                </div>
              </div>
              {/* Window content */}
              <div className="bg-background/50 p-4 sm:p-6">
                <div className="grid h-80 grid-cols-12 gap-4">
                  {/* Conversation list */}
                  <div className="col-span-4 hidden rounded-xl border border-border/60 bg-card p-4 sm:block">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand/15" />
                      <div className="flex-1">
                        <div className="h-2.5 w-20 rounded bg-foreground/20" />
                        <div className="mt-1 h-2 w-14 rounded bg-muted-foreground/25" />
                      </div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`mb-2 flex items-center gap-3 rounded-lg p-2 ${
                          i === 1 ? "bg-brand/10" : ""
                        }`}
                      >
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-2 w-full rounded bg-foreground/10" />
                          <div className="mt-1 h-2 w-2/3 rounded bg-muted-foreground/15" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Active conversation */}
                  <div className="col-span-12 rounded-xl border border-border/60 bg-card p-4 sm:col-span-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand/15" />
                        <div>
                          <div className="h-3 w-24 rounded bg-foreground/20" />
                          <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/25" />
                        </div>
                      </div>
                      <div className="rounded-full bg-green-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-green-600 dark:text-green-400">
                        Resolved
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted" />
                        <div className="max-w-xs rounded-lg rounded-tl-none bg-muted p-3">
                          <div className="h-2 w-full rounded bg-foreground/10" />
                          <div className="mt-1.5 h-2 w-4/5 rounded bg-foreground/10" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <div className="max-w-xs rounded-lg rounded-tr-none bg-brand-gradient p-3">
                          <div className="h-2 w-32 rounded bg-white/40" />
                          <div className="mt-1.5 h-2 w-20 rounded bg-white/40" />
                        </div>
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-brand/15" />
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted" />
                        <div className="max-w-xs rounded-lg rounded-tl-none bg-muted p-3">
                          <div className="h-2 w-40 rounded bg-foreground/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
