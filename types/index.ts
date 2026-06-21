import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  role: "customer" | "agent" | "admin";
  display_name: string | null;
  avatar_url: string | null;
}

export interface AuthUser {
  user: User | null;
  profile: UserProfile | null;
}
