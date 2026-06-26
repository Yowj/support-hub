import type { SupabaseClient } from "@supabase/supabase-js";
import type { Ticket } from "@/types/ticket";

export type AgentFilter = "all" | "unassigned" | "assigned" | "mine";

export interface AgentStats {
  all: number;
  unassigned: number;
  mine: number;
  assigned: number;
}

// function for getting agent stats and tickets
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

/// Fetch the agent queue tickets, scoped by filter.
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
  agent: { id: string; email?: string }
): Promise<void> {
  const { error: updateError } = await supabase
    .from("support_tickets")
    .update({ agent_id: agent.id, status: "in_progress" })
    .eq("id", ticketId);
  if (updateError) throw updateError;

  const agentLabel = agent.email || "A support agent";
  await supabase.from("chat_messages").insert([
    {
      ticket_id: ticketId,
      sender_id: agent.id,
      sender_type: "system",
      message: `${agentLabel} has been assigned to this ticket.`,
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
