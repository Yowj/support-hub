export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  customer_id: string;
  agent_id: string | null;
  customer_email?: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: "customer" | "agent" | "system";
  message: string;
  timestamp: string;
  read_at: string | null;
}
