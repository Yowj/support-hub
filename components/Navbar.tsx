"use client";

import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const WORDMARK = "SupportHub";

// Let the hero headline land first; the nav console boots online as act two.
const NAV_DELAY = 0.8;

// Wordmark "types" itself in: each letter rises out of a blur, left to right.
const wordmarkContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: NAV_DELAY + 0.3 } },
};
const letter: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.42, ease: EASE } },
};

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

  const reduce = useReducedMotion();

  return (
    <motion.nav
      className="relative h-16 shrink-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
    >
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="SupportHub — home" className="flex items-center gap-2">
            {/* Icon springs in and emits one ping, echoing the hero's live dot */}
            <span className="relative inline-flex">
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-foreground"
                  initial={{ scale: 1, opacity: 0.45 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: NAV_DELAY + 0.25 }}
                />
              )}
              <motion.span
                className="relative w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
                initial={reduce ? false : { scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 520, damping: 17, delay: NAV_DELAY + 0.05 }
                }
              >
                <MessageSquare className="w-4 h-4 text-background" />
              </motion.span>
            </span>

            <motion.span
              aria-label={WORDMARK}
              className="text-lg font-semibold tracking-tight"
              variants={reduce ? undefined : wordmarkContainer}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              {reduce
                ? WORDMARK
                : WORDMARK.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="inline-block"
                      variants={letter}
                    >
                      {char}
                    </motion.span>
                  ))}
            </motion.span>
          </Link>

          {user ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: reduce ? 0 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : NAV_DELAY + 0.55 }}
            >
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
            </motion.div>
          ) : (
            <motion.div
              className="flex h-16 items-center gap-2"
              initial={{ opacity: 0, x: reduce ? 0 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : NAV_DELAY + 0.55 }}
            >
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* "Signal established" — brand line draws across the base, then settles */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-brand-gradient"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 1.4, ease: EASE, times: [0, 0.55, 1], delay: NAV_DELAY }}
        />
      )}
    </motion.nav>
  );
}
