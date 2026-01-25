"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  MessageSquare,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                SupportHub
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/50 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Now with AI-powered responses
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
              Customer support
              <br />
              <span className="text-muted-foreground">that actually works</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
              A modern support platform that helps your team deliver
              exceptional customer experiences. Real-time chat, smart routing,
              and powerful analytics.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  Start free trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                Watch demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-border/50 animate-fade-in-up animation-delay-600">
              <div className="text-center">
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-muted-foreground">
                  Active users
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero image/mockup */}
          <div className="mt-20 relative animate-fade-in-up animation-delay-600">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground">
                      app.supporthub.io
                    </div>
                  </div>
                </div>
                {/* App mockup content */}
                <div className="p-6 bg-background/50">
                  <div className="grid grid-cols-12 gap-4 h-80">
                    {/* Sidebar */}
                    <div className="col-span-3 rounded-lg border border-border/50 bg-card p-4">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10" />
                        <div>
                          <div className="h-3 w-20 bg-foreground/20 rounded" />
                          <div className="h-2 w-14 bg-muted-foreground/20 rounded mt-1" />
                        </div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-2 rounded-md mb-2 ${i === 1 ? "bg-primary/10" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-muted" />
                          <div className="flex-1">
                            <div className="h-2 w-full bg-foreground/10 rounded" />
                            <div className="h-2 w-2/3 bg-muted-foreground/10 rounded mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Main content */}
                    <div className="col-span-9 rounded-lg border border-border/50 bg-card p-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10" />
                          <div>
                            <div className="h-3 w-24 bg-foreground/20 rounded" />
                            <div className="h-2 w-16 bg-muted-foreground/20 rounded mt-1" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs">
                            Resolved
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {/* Chat messages */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                          <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-xs">
                            <div className="h-2 w-full bg-foreground/10 rounded" />
                            <div className="h-2 w-4/5 bg-foreground/10 rounded mt-1" />
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-xs">
                            <div className="h-2 w-32 bg-primary-foreground/30 rounded" />
                            <div className="h-2 w-20 bg-primary-foreground/30 rounded mt-1" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0" />
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                          <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-xs">
                            <div className="h-2 w-40 bg-foreground/10 rounded" />
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

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to
              <br />
              delight your customers
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features that help your team work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature cards */}
            {[
              {
                icon: MessageSquare,
                title: "Real-time Chat",
                description:
                  "Engage with customers instantly through live chat. No more waiting for email responses.",
              },
              {
                icon: Zap,
                title: "Smart Routing",
                description:
                  "Automatically route tickets to the right team members based on skills and availability.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description:
                  "AI-powered responses handle common queries around the clock, even when you're away.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Internal notes, mentions, and shared inboxes keep your team perfectly in sync.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Track response times, customer satisfaction, and agent performance in real-time.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "50%", label: "Faster response times" },
              { value: "3x", label: "More tickets resolved" },
              { value: "95%", label: "Customer satisfaction" },
              { value: "24/7", label: "AI-powered support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Loved by support teams
              <br />
              around the world
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "SupportHub transformed how we handle customer inquiries. Our response time dropped from hours to minutes.",
                author: "Sarah Chen",
                role: "Head of Support, TechFlow",
                avatar: "SC",
              },
              {
                quote:
                  "The AI features are incredible. It handles 60% of our tickets automatically, letting our team focus on complex issues.",
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
                  "The analytics dashboard gives us insights we never had before. We can actually measure and improve our support.",
                author: "David Kim",
                role: "VP Customer Success, DataDrive",
                avatar: "DK",
              },
              {
                quote:
                  "Customer satisfaction scores went up 40% after switching to SupportHub. The difference is night and day.",
                author: "Lisa Thompson",
                role: "Support Lead, FinanceApp",
                avatar: "LT",
              },
              {
                quote:
                  "The best investment we made this year. ROI was evident within the first month of using SupportHub.",
                author: "Alex Patel",
                role: "CEO, GrowthCo",
                avatar: "AP",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border/50 bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you need to. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-border/50 bg-card">
              <h3 className="text-lg font-semibold mb-2">Starter</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Perfect for small teams
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 3 team members",
                  "100 tickets/month",
                  "Email support",
                  "Basic analytics",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-primary bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Most popular
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <p className="text-sm text-muted-foreground mb-6">
                For growing businesses
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 10 team members",
                  "Unlimited tickets",
                  "Priority support",
                  "Advanced analytics",
                  "AI-powered responses",
                  "Custom workflows",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className="w-full">Get started</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-border/50 bg-card">
              <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-6">
                For large organizations
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited team members",
                  "Unlimited tickets",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantees",
                  "On-premise option",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-12 lg:p-20">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/80" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-background/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-background/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Ready to transform your customer support?
              </h2>
              <p className="text-lg text-background/70 mb-10">
                Join thousands of companies already using SupportHub to deliver
                exceptional customer experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base bg-background text-foreground hover:bg-background/90"
                  >
                    Start free trial
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-background/20 text-background hover:bg-background/10"
                >
                  Schedule demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-background" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  SupportHub
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern customer support platform for teams that care about their
                customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 SupportHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
