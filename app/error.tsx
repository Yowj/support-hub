"use client";

import { useEffect } from "react";
import Link from "next/link";
import HalftoneCanvas from "@/components/landing/HalftoneCanvas";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const ticket = error.digest ? error.digest.slice(0, 6).toUpperCase() : "UNFILED";
  const detail =
    error.message || "An unexpected error interrupted this request before we could finish it.";

  return (
    <section className="relative flex min-h-full flex-col overflow-hidden bg-background text-foreground">
      <HalftoneCanvas />
      <div className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-y-10 gap-x-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
        {/* Left — the loud part */}
        <div className="lg:col-span-7">
          <p className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Error · ticket #{ticket}
          </p>

          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Well, this ticket{" "}
            <span className="font-serif italic font-normal text-brand-gradient">
              wandered off
            </span>
            .
          </h1>
        </div>

        {/* Right — the calm part */}
        <div className="lg:col-span-5">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Even the best support desks drop one now and then. Nothing you did
            caused this — let&apos;s get you back to a page that behaves.
          </p>

          <div className="mt-7 rounded-2xl border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              What happened
            </p>
            <p className="mt-1.5 break-words font-mono text-sm text-card-foreground/80">
              {detail}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="rounded-full bg-brand-gradient px-7 py-3.5 text-center text-base font-semibold text-on-brand shadow-lg shadow-brand/25 transition hover:opacity-95 hover:shadow-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Try it again
            </button>
            <Link
              href="/"
              className="rounded-full border border-border px-7 py-3.5 text-center text-base font-semibold text-foreground transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Take me home
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Still stuck? Email{" "}
            <a
              href="mailto:eugenecoderx@gmail.com"
              className="font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4"
            >
              eugenecoderx@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
