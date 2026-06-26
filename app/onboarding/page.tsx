import { getUserProfile } from "@/lib/auth";
import OnboardingForm from "@/components/auth/OnboardingForm";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }

  // Already onboarded — don't let them redo it.
  if (profile?.onboarded) {
    return redirect("/dashboard");
  }

  // The default display_name is the email handle; treat that as "not yet set".
  const emailHandle = user.email?.split("@")[0];
  const existingName =
    profile?.display_name && profile.display_name !== emailHandle
      ? profile.display_name
      : "";

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-dot-grid px-6 py-16">
      <div className="brand-glow pointer-events-none absolute inset-x-0 top-0 h-72" />
      <OnboardingForm userId={user.id} initialName={existingName} />
    </div>
  );
}
