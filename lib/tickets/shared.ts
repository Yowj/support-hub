/**
 * Broadcast channel used to notify the agent dashboard of new tickets.
 *
 * We use Supabase Broadcast instead of relying on postgres_changes because the
 * agent's SELECT RLS policy uses a cross-table EXISTS subquery, which Supabase
 * Realtime may not evaluate correctly for INSERT events from other users.
 * Broadcast bypasses RLS entirely — all subscribers on this channel receive it.
 *
 * Shared by the agent queue (subscriber) and customer createTicket (sender).
 */
export const TICKETS_BROADCAST_CHANNEL = "support-hub:tickets";
