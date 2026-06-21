"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--text-primary)] hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-110 active:scale-95 transition-all"
      aria-label="Toggle dark mode"
    >
      {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
    </button>
  );
}
