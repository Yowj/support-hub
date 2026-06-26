import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AuthUser, UserProfile } from "@/types";

/**
 * Single source of truth for where a logged-in user belongs:
 * unfinished onboarding first, then their role's dashboard.
 */
export function resolveLandingRoute(profile: UserProfile | null): string {
  if (!profile?.onboarded) return "/onboarding";
  if (profile.role === "agent" || profile.role === "admin") return "/agent";
  return "/dashboard";
}

export const getUserProfile = cache(async (): Promise<AuthUser> => {
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
});


//TODO: We need to get rid of this function, we make DB trigger instead
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