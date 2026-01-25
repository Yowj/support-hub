import { getUserProfile, ensureUserProfile } from "@/lib/auth";
import AuthButton from "@/components/auth-button";
import CustomerDashboard from "@/components/customer-dashboard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function Dashboard() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }

  if (!profile) {
    await ensureUserProfile(user.id, user.email || "");
    return redirect("/dashboard");
  }

  if (profile.role === "agent" || profile.role === "admin") {
    return redirect("/agent");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                SupportHub
              </span>
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.display_name || user.email}
          </p>
        </div>
        <CustomerDashboard user={user} />
      </div>
    </main>
  );
}
