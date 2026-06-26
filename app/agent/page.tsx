import { getUserProfile, ensureUserProfile, resolveLandingRoute } from "@/lib/auth";
import AgentDashboard from "@/app/agent/_components/AgentDashboard";
import { redirect } from "next/navigation";

export default async function AgentPage() {
  // ! We need to fetch user from server for security purposes, since the client can be manipulated by the user.
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }
  if (!profile) {
    await ensureUserProfile(user.id, user.email || "");
    return redirect("/agent");
  }

  // Onboarding-incomplete or wrong-role users get routed away.
  const target = resolveLandingRoute(profile);
  if (target !== "/agent") {
    return redirect(target);
  }

  return <AgentDashboard user={{ id: user.id, email: user.email }} />;
}
