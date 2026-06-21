"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, Shield, Clock, Users, BarChart3, ArrowRight, Star, Sparkles } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
              <span className="text-sm font-medium">Now with AI-powered responses</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
              Customer support
              <br />
              <span className="text-muted-foreground">that actually works</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
              A modern support platform that helps your team deliver exceptional customer experiences. Real-time chat,
              smart routing, and powerful analytics.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  Start free trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Watch demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-border/50 animate-fade-in-up animation-delay-600">
              <div className="text-center">
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-muted-foreground">Active users</div>
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
                          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs">Resolved</div>
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
                description: "Engage with customers instantly through live chat. No more waiting for email responses.",
              },
              {
                icon: Zap,
                title: "Smart Routing",
                description: "Automatically route tickets to the right team members based on skills and availability.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "AI-powered responses handle common queries around the clock, even when you're away.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Internal notes, mentions, and shared inboxes keep your team perfectly in sync.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track response times, customer satisfaction, and agent performance in real-time.",
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
                <div className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Loved by support teams
              <br />
              around the world
            </h2>
            <p className="text-lg text-muted-foreground">See what our customers have to say about their experience.</p>
          </div>
        </div>

        {/* Marquee container */}
        <div className="relative">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-marquee">
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
              // Duplicate for seamless loop
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
              <div key={index} className="flex-shrink-0 w-[350px] p-6 rounded-2xl border border-border/50 bg-card">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
