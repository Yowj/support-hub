import type { SupabaseClient } from "@supabase/supabase-js";
import type { Ticket } from "@/types/ticket";
import { TICKETS_BROADCAST_CHANNEL } from "@/lib/tickets/shared";

export type CustomerFilter = "all" | "open" | "active" | "resolved";

export interface CustomerStats {
  all: number;
  open: number;
  active: number;
  resolved: number;
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
