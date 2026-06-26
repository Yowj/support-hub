"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/shared/AuthInput";
import OAuthButtons from "@/components/shared/OAuthButtons";
import { getPasswordStrength, getStrengthMeta } from "@/lib/auth/password-strength";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const strength = password.length > 0 ? getPasswordStrength(password) : 0;
  const strengthMeta = getStrengthMeta(strength);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setIsError(true);
      setMessage(error.message);
      setIsLoading(false);
    } else if (data.session) {
      router.push("/onboarding");
    } else if (data.user) {
      setIsError(false);
      setMessage("Check your email to confirm your account!");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">Join SupportHub to get started</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
        {message && (
          <div className={`flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 text-sm border
            ${isError
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-success/10 border-success/20 text-success"
            }`}>
            {isError
              ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            }
            <span>{message}</span>
          </div>
        )}

        <OAuthButtons onError={(msg) => { setIsError(true); setMessage(msg); }} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSignUp} className="space-y-3">
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <div className="space-y-1.5">
            <AuthInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              required
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
            {password.length > 0 && (
              <div className="space-y-1 px-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= strength ? strengthMeta.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Strength:{" "}
                  <span className={`font-semibold ${strengthMeta.text}`}>
                    {strengthMeta.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <AuthInput
              id="confirm-password"
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              error={passwordsMismatch}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              }
            />
            {passwordsMatch && (
              <p className="text-[11px] text-success flex items-center gap-1 px-0.5">
                <CheckCircle2 className="w-3 h-3" /> Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p className="text-[11px] text-destructive flex items-center gap-1 px-0.5">
                <AlertCircle className="w-3 h-3" /> Passwords don&apos;t match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || passwordsMismatch}
            className="w-full py-2.5 bg-foreground hover:bg-foreground/90 active:bg-foreground/80 text-background font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating account…
              </>
            ) : "Create account"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
