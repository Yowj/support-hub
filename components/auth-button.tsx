import { getUserProfile } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogOut, User } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarGradient(role: string): string {
  switch (role) {
    case "agent":
      return "from-purple-500 to-indigo-500";
    case "admin":
      return "from-rose-500 to-pink-500";
    default:
      return "from-blue-400 to-cyan-500";
  }
}

export default async function AuthButton() {
  const { user, profile } = await getUserProfile();

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const role = profile?.role || "customer";
  const initials = getInitials(displayName);
  const gradient = getAvatarGradient(role);

  return user ? (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2.5 pr-1">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
        >
          <span className="text-white font-semibold text-sm">{initials}</span>
        </div>
        <div className="hidden md:block leading-tight">
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
            {displayName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ModeToggle />
        <form action={signOut}>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 gap-1.5 px-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Logout</span>
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Link href="/login">
        <Button variant="outline" size="sm" className="gap-1.5">
          <User className="h-4 w-4" />
          Login
        </Button>
      </Link>
    </div>
  );
}
