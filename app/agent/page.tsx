import { getUserProfile, ensureUserProfile } from "@/lib/auth";
import AgentDashboard from "@/components/agent-dashboard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

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

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="flex-shrink-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="h-full max-w-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
              SupportHub
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {profile.display_name || user.email}
              </p>
              <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
            </div>

          </div>
        </div>
      </nav>

      {/* Split pane fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <AgentDashboard user={user} />
      </div>
    </div>
  );
}
