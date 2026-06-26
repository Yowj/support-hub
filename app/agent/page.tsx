import { getUserProfile, ensureUserProfile } from "@/lib/auth";
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

  // Incomplete onboarding — resume it before showing the app.
  if (!profile.onboarded) {
    return redirect("/onboarding");
  }

  if (profile.role === "customer") {
    return redirect("/dashboard");
  }

  return <AgentDashboard user={{ id: user.id, email: user.email }} />;
}
