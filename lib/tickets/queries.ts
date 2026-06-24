import type { SupabaseClient } from "@supabase/supabase-js";
import type { Ticket } from "@/types/ticket";

/**
 * Broadcast channel used to notify the agent dashboard of new tickets.
 *
 * We use Supabase Broadcast instead of relying on postgres_changes because the
 * agent's SELECT RLS policy uses a cross-table EXISTS subquery, which Supabase
 * Realtime may not evaluate correctly for INSERT events from other users.
 * Broadcast bypasses RLS entirely — all subscribers on this channel receive it.
 */
export const TICKETS_BROADCAST_CHANNEL = "support-hub:tickets";

export type AgentFilter = "all" | "unassigned" | "assigned" | "mine";
export type CustomerFilter = "all" | "open" | "active" | "resolved";

export interface AgentStats {
  all: number;
  unassigned: number;
  mine: number;
  assigned: number;
}

export interface CustomerStats {
  all: number;
  open: number;
  active: number;
  resolved: number;
}

/** Aggregate open-ticket counts for the agent queue tabs. */
export async function fetchAgentStats(
  supabase: SupabaseClient,
  userId: string
): Promise<AgentStats | null> {
  const { data } = await supabase
    .from("support_tickets")
    .select("agent_id")
    .neq("status", "closed");
  if (!data) return null;
  return {
    all: data.length,
    unassigned: data.filter((t) => !t.agent_id).length,
    mine: data.filter((t) => t.agent_id === userId).length,
    assigned: data.filter((t) => t.agent_id !== null).length,
  };
}

/** Fetch the (non-closed) ticket queue for an agent, scoped by filter. */
export async function fetchAgentTickets(
  supabase: SupabaseClient,
  filter: AgentFilter,
  userId: string
): Promise<Ticket[]> {
  let query = supabase
    .from("support_tickets")
    .select(
      `*,
      customer:user_profiles!customer_id (
        id,
        display_name,
        avatar_url
      )`
    )
    .neq("status", "closed")
    .order("created_at", { ascending: false });

  switch (filter) {
    case "unassigned":
      query = query.is("agent_id", null);
      break;
    case "assigned":
      query = query.not("agent_id", "is", null);
      break;
    case "mine":
      query = query.eq("agent_id", userId);
      break;
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching tickets:", error.message, error.code);
    throw error;
  }

  return (data || []).map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    customer_id: ticket.customer_id,
    agent_id: ticket.agent_id,
    customer_email: ticket.customer?.display_name || "Unknown Customer",
  }));
}

/** Assign a ticket to an agent and log a system message. */
export async function assignTicket(
  supabase: SupabaseClient,
  ticketId: string,
  agent: { id: string; email: string }
): Promise<void> {
  const { error: updateError } = await supabase
    .from("support_tickets")
    .update({ agent_id: agent.id, status: "in_progress" })
    .eq("id", ticketId);
  if (updateError) throw updateError;

  await supabase.from("chat_messages").insert([
    {
      ticket_id: ticketId,
      sender_id: agent.id,
      sender_type: "system",
      message: `Agent ${agent.email} has been assigned to this ticket.`,
    },
  ]);
}

/** Update a ticket's status and log a system message. */
export async function updateTicketStatus(
  supabase: SupabaseClient,
  ticketId: string,
  status: string,
  agentId: string
): Promise<void> {
  const { error: updateError } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId);
  if (updateError) throw updateError;

  await supabase.from("chat_messages").insert([
    {
      ticket_id: ticketId,
      sender_id: agentId,
      sender_type: "system",
      message: `Ticket status changed to ${status}.`,
    },
  ]);
}

/** Aggregate ticket counts for the customer's own tickets. */
export async function fetchCustomerStats(
  supabase: SupabaseClient,
  userId: string
): Promise<CustomerStats | null> {
  const { data } = await supabase
    .from("support_tickets")
    .select("status")
    .eq("customer_id", userId);
  if (!data) return null;
  return {
    all: data.length,
    open: data.filter((t) => t.status === "open").length,
    active: data.filter((t) => t.status === "in_progress").length,
    resolved: data.filter((t) => t.status === "resolved" || t.status === "closed").length,
  };
}

/** Fetch a customer's own tickets, scoped by filter. */
export async function fetchCustomerTickets(
  supabase: SupabaseClient,
  filter: CustomerFilter,
  userId: string
): Promise<Ticket[]> {
  let query = supabase
    .from("support_tickets")
    .select("*")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  switch (filter) {
    case "open":
      query = query.eq("status", "open");
      break;
    case "active":
      query = query.eq("status", "in_progress");
      break;
    case "resolved":
      query = query.in("status", ["resolved", "closed"]);
      break;
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
  return (data as Ticket[]) || [];
}

/** Create a new ticket with its opening message and broadcast the event. */
export async function createTicket(
  supabase: SupabaseClient,
  params: { userId: string; subject: string; message: string; priority: string }
): Promise<string> {
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert([
      {
        customer_id: params.userId,
        subject: params.subject,
        priority: params.priority,
        status: "open",
      },
    ])
    .select()
    .single();

  if (ticketError) throw ticketError;

  const { error: messageError } = await supabase.from("chat_messages").insert([
    {
      ticket_id: ticket.id,
      sender_id: params.userId,
      sender_type: "customer",
      message: params.message,
    },
  ]);

  if (messageError) throw messageError;

  // Notify the agent dashboard in real-time that a new ticket was created.
  await supabase.channel(TICKETS_BROADCAST_CHANNEL).send({
    type: "broadcast",
    event: "ticket-created",
    payload: { ticketId: ticket.id },
  });

  return ticket.id;
}
