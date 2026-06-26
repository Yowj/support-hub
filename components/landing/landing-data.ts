import {
  MessageSquare,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  PenTool,
  Code2,
  ShoppingBag,
  Building2,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: FeatureItem[] = [
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

export const teams: FeatureItem[] = [
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

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "SupportHub transformed how we handle inquiries. Our response time dropped from hours to minutes.",
    author: "Sarah Chen",
    role: "Head of Support, TechFlow",
  },
  {
    quote:
      "The AI features are incredible. They handle 60% of our tickets automatically, so the team focuses on the hard ones.",
    author: "Marcus Johnson",
    role: "CTO, StartupXYZ",
  },
  {
    quote:
      "Finally, a support tool that's actually easy to use. Our team was up and running in less than a day.",
    author: "Emily Rodriguez",
    role: "Operations Manager, CloudScale",
  },
  {
    quote:
      "The analytics gave us insights we never had before. We can finally measure and improve our support.",
    author: "David Kim",
    role: "VP Customer Success, DataDrive",
  },
  {
    quote:
      "Customer satisfaction went up 40% after switching. The difference is night and day.",
    author: "Lisa Thompson",
    role: "Support Lead, FinanceApp",
  },
  {
    quote:
      "The best investment we made this year. ROI was evident within the first month.",
    author: "Alex Patel",
    role: "CEO, GrowthCo",
  },
];

export const stats = [
  { value: "50%", label: "Faster response times" },
  { value: "3×", label: "More tickets resolved" },
  { value: "95%", label: "Customer satisfaction" },
  { value: "24/7", label: "AI-powered coverage" },
];

export const trustedBy = ["TechFlow", "CloudScale", "DataDrive", "GrowthCo", "FinanceApp"];

export const footerColumns = [
  { title: "Product", links: ["Features", "Integrations", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];
