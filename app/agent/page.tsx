import { getUserProfile, ensureUserProfile } from "@/lib/auth";
import AuthButton from "@/components/auth-button";
import AgentDashboard from "@/components/agent-dashboard";
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
    return redirect("/");
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile.display_name || user.email}</p>
          </div>
          <AuthButton />
        </div>
        <AgentDashboard user={user} />
      </div>
    </main>
  );
}
