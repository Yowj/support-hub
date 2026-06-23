import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./Reveal";

export default function ClosingCta() {
  return (
    <Reveal className="px-6 pb-24 lg:px-8 lg:pb-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 text-center sm:py-20">
        <div className="absolute inset-x-0 top-0 -z-0 h-full brand-glow opacity-70" />
        <div className="relative z-10">
          <Eyebrow>Start today</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Support that feels{" "}
            <span className="font-serif italic font-normal text-brand-gradient">
              effortless
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Join thousands of teams resolving more, faster. Free for 14 days —
            no card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 gap-2 border-0 bg-brand-gradient px-7 text-base text-white shadow-lg shadow-brand/25 transition hover:opacity-95"
              >
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-7 text-base">
                Talk to sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
