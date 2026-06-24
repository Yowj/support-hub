"use client";

import { useEffect } from "react";
import Link from "next/link";
import HalftoneCanvas from "@/components/landing/HalftoneCanvas";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const ticket = error.digest ? error.digest.slice(0, 6).toUpperCase() : "UNFILED";
  const detail = error.message || "An unexpected error interrupted this request before we could finish it.";

  return (
    <section className="relative flex min-h-full flex-col bg-[#F5F1E8] dark:bg-[#141414] text-[#100F0E] [--ec:hsl(213_100%_48%)]">
      <HalftoneCanvas />
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-y-10 gap-x-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
        {/* Left — the loud part */}
        <div className="lg:col-span-7">
          <p className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#100F0E]/60">
            <span className="h-2 w-2 rounded-full bg-[var(--ec)]" />
            Error · ticket #{ticket}
          </p>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Well, this ticket{" "}
            <span className="bg-[var(--ec)] box-decoration-clone px-2 text-[#F5F1E8] [transform:rotate(-1.5deg)] inline-block">
              wandered off
            </span>
            .
          </h1>
        </div>

        {/* Right — the calm part */}
        <div className="lg:col-span-5">
          <p className="text-lg leading-relaxed text-[#100F0E]/75">
            Even the best support desks drop one now and then. Nothing you did caused this — let&apos;s get you back to
            a page that behaves.
          </p>

          <div className="mt-7 rounded-2xl border-2 border-[#100F0E]/10 bg-white/60 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#100F0E]/45">What happened</p>
            <p className="mt-1.5 break-words font-mono text-sm text-[#100F0E]/80">{detail}</p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="rounded-full bg-[#100F0E] px-7 py-3.5 text-center text-base font-semibold text-[#F5F1E8] transition hover:bg-[var(--ec)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#100F0E]"
            >
              Try it again
            </button>
            <Link
              href="/"
              className="rounded-full border-2 border-[#100F0E] px-7 py-3.5 text-center text-base font-semibold text-[#100F0E] transition hover:bg-[#100F0E] hover:text-[#F5F1E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#100F0E]"
            >
              Take me home
            </Link>
          </div>

          <p className="mt-5 text-sm text-[#100F0E]/55">
            Still stuck? Email{" "}
            <a
              href="mailto:support@supporthub.io"
              className="font-medium text-[#100F0E] underline decoration-[var(--ec)] decoration-2 underline-offset-4"
            >
              eugenecoderx@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
