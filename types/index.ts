import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string;
  role: "customer" | "agent" | "admin";
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  customer_id: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: "customer" | "agent";
  message: string;
  timestamp: string;
}

export interface AuthUser {
  user: User | null;
  profile: UserProfile | null;
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type UserRole = "customer" | "agent" | "admin";