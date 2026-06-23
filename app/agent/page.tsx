import { getUserProfile, ensureUserProfile } from "@/lib/auth";
import AgentDashboard from "@/app/agent/_components/AgentDashboard";
import { redirect } from "next/navigation";

export default async function AgentPage() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }
  if (!profile) {
    await ensureUserProfile(user.id, user.email || "");
    return redirect("/agent");
  }

  if (profile.role === "customer") {
    return redirect("/dashboard");
  }

  return <AgentDashboard user={user} />;
}
