"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
  Star,
  Check,
  PenTool,
  Code2,
  ShoppingBag,
  Building2,
} from "lucide-react";

/* Small mono eyebrow used to label every section — Supaste-style utility type. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
      {children}
    </span>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "Real-time chat",
    description:
      "Talk to customers the moment they reach out. Live conversations, typing indicators, and instant delivery — no waiting on email.",
  },
  {
    icon: Zap,
    title: "Smart routing",
    description:
      "Every ticket lands with the right person. Route by skill, workload, and availability so nothing sits in a shared inbox.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "Bank-level encryption with SOC 2, GDPR, and HIPAA compliance baked in. Your customers' data stays protected.",
  },
  {
    icon: Clock,
    title: "Around the clock",
    description:
      "AI-drafted replies handle common questions day and night, so your team wakes up to a calmer queue.",
  },
  {
    icon: Users,
    title: "Built for teams",
    description:
      "Internal notes, @mentions, and shared inboxes keep everyone in sync on a single conversation.",
  },
  {
    icon: BarChart3,
    title: "Live analytics",
    description:
      "Watch response times, satisfaction, and agent performance update in real time — and act on what you see.",
  },
];

const teams = [
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description:
      "Handle order questions, returns, and shipping updates in one thread, with customer history right beside the chat.",
  },
  {
    icon: Code2,
    title: "SaaS & Tech",
    description:
      "Triage bug reports and feature requests, route them to the right engineer, and close the loop automatically.",
  },
  {
    icon: PenTool,
    title: "Agencies",
    description:
      "Run support for every client from a single workspace, with separate inboxes and per-brand reporting.",
  },
  {
    icon: Building2,
    title: "Enterprise",
    description:
      "Scale across departments with roles, audit logs, and SLAs that keep large teams accountable.",
  },
];

const testimonials = [
  {
    quote:
      "SupportHub transformed how we handle inquiries. Our response time dropped from hours to minutes.",
    author: "Sarah Chen",
    role: "Head of Support, TechFlow",
    avatar: "SC",
  },
  {
    quote:
      "The AI features are incredible. They handle 60% of our tickets automatically, so the team focuses on the hard ones.",
    author: "Marcus Johnson",
    role: "CTO, StartupXYZ",
    avatar: "MJ",
  },
  {
    quote:
      "Finally, a support tool that's actually easy to use. Our team was up and running in less than a day.",
    author: "Emily Rodriguez",
    role: "Operations Manager, CloudScale",
    avatar: "ER",
  },
  {
    quote:
      "The analytics gave us insights we never had before. We can finally measure and improve our support.",
    author: "David Kim",
    role: "VP Customer Success, DataDrive",
    avatar: "DK",
  },
  {
    quote:
      "Customer satisfaction went up 40% after switching. The difference is night and day.",
    author: "Lisa Thompson",
    role: "Support Lead, FinanceApp",
    avatar: "LT",
  },
  {
    quote:
      "The best investment we made this year. ROI was evident within the first month.",
    author: "Alex Patel",
    role: "CEO, GrowthCo",
    avatar: "AP",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
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
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 text-base"
              >
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

      {/* ── Trust strip ──────────────────────────────────────── */}
      <section className="border-y border-border/50 py-10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by support teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold tracking-tight text-muted-foreground/70">
            {["TechFlow", "CloudScale", "DataDrive", "GrowthCo", "FinanceApp"].map(
              (name) => (
                <span key={name} className="transition-colors hover:text-foreground">
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Feature highlight (alternating) ─────────────────── */}
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
                {[
                  "Unified timeline across every channel",
                  "Customer history and order data inline",
                  "Internal notes and @mentions for the team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/15">
                      <Check className="h-3 w-3 text-brand" />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stacked clip-style cards, echoing the Supaste shelf */}
            <div className="relative">
              <div className="absolute -inset-6 -z-10 brand-glow opacity-60" />
              <div className="space-y-3">
                {[
                  { tag: "CHAT", text: "Where is my order #4821?", time: "now" },
                  { tag: "EMAIL", text: "Re: Refund request", time: "2m" },
                  { tag: "AI DRAFT", text: "Your order shipped this morning…", time: "2m" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm ${
                      i === 2 ? "ring-1 ring-brand/40" : ""
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

      {/* ── Feature grid ─────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-muted/30 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>Everything included</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
              Built for teams that want to{" "}
              <span className="font-serif italic font-normal text-brand-gradient">
                delight
              </span>{" "}
              customers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features that help your team work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card p-8 transition-colors hover:bg-accent/40"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {[
              { value: "50%", label: "Faster response times" },
              { value: "3×", label: "More tickets resolved" },
              { value: "95%", label: "Customer satisfaction" },
              { value: "24/7", label: "AI-powered coverage" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-semibold tracking-tight lg:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for every team ─────────────────────────────── */}
      <section className="border-t border-border/50 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>However you support</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
              Made for every kind of team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From a two-person startup to a global enterprise, SupportHub bends
              to the way you already work.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {teams.map((team, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-brand/40"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <team.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{team.title}</h3>
                <p className="text-muted-foreground">{team.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials marquee ─────────────────────────────── */}
      <section id="testimonials" className="overflow-hidden border-t border-border/50 py-24 lg:py-32">
        <div className="mx-auto mb-16 max-w-2xl px-6 text-center lg:px-8">
          <Eyebrow>Loved by support teams</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
            Don&apos;t just take our{" "}
            <span className="font-serif italic font-normal text-brand-gradient">
              word for it
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max gap-6 animate-marquee">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="w-[350px] flex-shrink-0 rounded-2xl border border-border/60 bg-card p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-foreground">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 font-mono text-sm font-medium text-brand">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="px-6 pb-24 lg:px-8 lg:pb-32">
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
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  SupportHub
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern customer support for teams that care about their
                customers.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Integrations", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-foreground">
                  {col.title}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 SupportHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[
                "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
              ].map((d, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
