"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/shared/AuthInput";
import OAuthButtons from "@/components/shared/OAuthButtons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your SupportHub account</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-3.5 py-2.5 text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <OAuthButtons onError={setError} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSignIn} className="space-y-3">
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            required
            error={!!error}
          />

          <AuthInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            required
            error={!!error}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input accent-primary"
              />
              <span className="text-xs text-muted-foreground">Keep me signed in</span>
            </label>
            <Link href="#" className="text-xs text-brand hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-foreground hover:bg-foreground/90 active:bg-foreground/80 text-background font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Signing in…
              </>
            ) : "Sign in"}
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 text-center space-y-2.5">
        <p className="text-[11px] font-bold tracking-widest text-brand uppercase">
          New to SupportHub?
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Create an account to track tickets and get faster support.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-2 border border-border text-foreground font-semibold rounded-full text-xs hover:bg-muted transition-colors"
        >
          Join now
        </Link>
      </div>
    </div>
  );
}
