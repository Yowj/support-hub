"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type Provider = "google" | "github";

/** Social sign-in buttons that kick off Supabase OAuth and redirect through /auth/callback. */
export default function OAuthButtons({ onError }: { onError?: (msg: string) => void }) {
  const [loading, setLoading] = useState<Provider | null>(null);

  const signIn = async (provider: Provider) => {
    setLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      onError?.(error.message);
      setLoading(null);
    }
    // On success the browser is redirected to the provider, so no need to reset.
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => signIn("google")}
        disabled={loading !== null}
        className="group flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background
          text-sm font-medium text-foreground transition-all duration-200
          hover:bg-muted hover:border-foreground/20 hover:-translate-y-0.5 active:translate-y-0
          disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading === "google" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <GoogleIcon className="w-4 h-4" />
        )}
        Google
      </button>

      <button
        type="button"
        onClick={() => signIn("github")}
        disabled={loading !== null}
        className="group flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background
          text-sm font-medium text-foreground transition-all duration-200
          hover:bg-muted hover:border-foreground/20 hover:-translate-y-0.5 active:translate-y-0
          disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading === "github" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <GitHubIcon className="w-4 h-4 fill-foreground" />
        )}
        GitHub
      </button>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-1.85c-3.06.67-3.7-1.48-3.7-1.48-.5-1.27-1.22-1.6-1.22-1.6-1-.69.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.39-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.01.75 2.04v3.03c0 .29.2.64.76.53A11 11 0 0 0 12 1Z" />
    </svg>
  );
}
