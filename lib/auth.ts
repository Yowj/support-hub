import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/types";

export async function getUserProfile(): Promise<AuthUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function ensureUserProfile(userId: string, email: string) {
  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    await supabase
      .from("user_profiles")
      .insert([
        {
          id: userId,
          role: "customer",
          display_name: email.split("@")[0],
        },
      ]);
  }
}