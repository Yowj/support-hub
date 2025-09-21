import { getUserProfile, ensureUserProfile } from "@/lib/auth";
import AuthButton from "@/components/auth-button";
import CustomerDashboard from "@/components/customer-dashboard";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }

  if (!profile) {
    await ensureUserProfile(user.id, user.email || "");
    return redirect("/");
  }

  if (profile.role === "agent" || profile.role === "admin") {
    return redirect("/agent");
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile.display_name || user.email}
            </p>
          </div>
          <AuthButton />
        </div>
        <CustomerDashboard user={user} />
      </div>
    </main>
  );
}
