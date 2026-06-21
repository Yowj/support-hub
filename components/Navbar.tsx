"use client";

import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, User, MessageSquare } from "lucide-react";
import Link from "next/link";

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

export default function Navbar() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const role = profile?.role || "customer";

  return (
    <nav className="h-16 shrink-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SupportHub</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 pr-1">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(role)} flex items-center justify-center shadow-sm flex-shrink-0`}
                >
                  <span className="text-white font-semibold text-sm">{getInitials(displayName)}</span>
                </div>
                <div className="hidden md:block leading-tight">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
                    {displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 gap-1.5 px-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-medium">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-16 items-center gap-2">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
