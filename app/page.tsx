import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import FeatureHighlight from "@/components/landing/FeatureHighlight";
import FeatureGrid from "@/components/landing/FeatureGrid";
import StatsBand from "@/components/landing/StatsBand";
import TeamsGrid from "@/components/landing/TeamsGrid";
import Testimonials from "@/components/landing/Testimonials";
import ClosingCta from "@/components/landing/ClosingCta";
import LandingFooter from "@/components/landing/LandingFooter";

export default async function LandingPage() {
  const { user, profile } = await getUserProfile();

  // Logged-in users skip the marketing page and go where they belong.
  if (user) {
    if (!profile?.onboarded) redirect("/onboarding");
    if (profile.role === "agent" || profile.role === "admin") redirect("/agent");
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <TrustStrip />
      <FeatureHighlight />
      <FeatureGrid />
      <StatsBand />
      <TeamsGrid />
      <Testimonials />
      <ClosingCta />
      <LandingFooter />
    </div>
  );
}
