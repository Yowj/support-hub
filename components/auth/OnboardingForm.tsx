"use client";

import { createClient } from "@/lib/supabase/client";
import { useMemo, useState } from "react";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/shared/AuthInput";
import AvatarPicker from "@/components/auth/AvatarPicker";
import UserAvatar from "@/components/shared/UserAvatar";

const MIN_LENGTH = 2;
const MAX_LENGTH = 32;

interface OnboardingFormProps {
  userId: string;
  initialName?: string;
}

/** Turn a display name into the lowercase @handle teammates will reference. */
function toHandle(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, MAX_LENGTH);
  return slug.length > 0 ? slug : "yourname";
}

export default function OnboardingForm({ userId, initialName = "" }: OnboardingFormProps) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const trimmed = name.trim();
  const isValid = trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;

  // Live identity preview — this is what agents see on a ticket.
  const previewName = useMemo(() => trimmed || "Your name", [trimmed]);
  const handle = useMemo(() => toHandle(trimmed), [trimmed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError(`Pick a name between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    // Update the existing profile; fall back to creating one if the row
    // hasn't been provisioned yet (e.g. straight from sign-up).
    const { data, error: updateError } = await supabase
      .from("user_profiles")
      .update({ display_name: trimmed, avatar_url: avatarUrl, onboarded: true })
      .eq("id", userId)
      .select("id");

    if (!updateError && (!data || data.length === 0)) {
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            role: "customer",
            display_name: trimmed,
            avatar_url: avatarUrl,
            onboarded: true,
          },
        ]);
      if (insertError) {
        setError(insertError.message);
        setIsLoading(false);
        return;
      }
    } else if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in-up">
      {/* Thesis: your identity, alive. This is the page's signature. */}
      <div className="flex flex-col items-center text-center">
        <span className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Welcome to SupportHub
        </span>

        <div className="relative mb-5">
          <span className="absolute -inset-3 rounded-full bg-brand-gradient opacity-20 blur-xl animate-breathe" />
          <div
            key={avatarUrl ?? previewName}
            className="relative animate-avatar-pop overflow-hidden rounded-full ring-1 ring-border/80 shadow-lg"
          >
            <UserAvatar name={previewName} src={avatarUrl} size={76} />
          </div>
        </div>

        {/* A real ticket bubble — exactly how an agent will see this person. */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-start gap-0.5">
            <span className="px-1 text-xs text-muted-foreground">
              {previewName}
            </span>
            <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5 text-sm text-foreground shadow-sm">
              Hi, I need a hand with my order.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          What should we{" "}
          <span className="font-serif italic font-normal text-brand-gradient">
            call you
          </span>
          ?
        </h1>
        <p className="text-sm text-muted-foreground">
          This is the name agents and teammates see on your tickets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <span className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Pick your avatar
          </span>
          <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} seedHint={trimmed} />
        </div>

        <div className="space-y-1.5">
          <AuthInput
            id="display-name"
            label="Display name"
            value={name}
            onChange={(v) => setName(v.slice(0, MAX_LENGTH))}
            required
          />
          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="font-mono text-muted-foreground">@{handle}</span>
            <span
              className={`tabular-nums ${
                trimmed.length > MAX_LENGTH - 6
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
            >
              {trimmed.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:bg-foreground/80 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Setting up…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          You can change this anytime in settings.
        </p>
      </form>
    </div>
  );
}
