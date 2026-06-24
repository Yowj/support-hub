import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import FeatureHighlight from "@/components/landing/FeatureHighlight";
import FeatureGrid from "@/components/landing/FeatureGrid";
import StatsBand from "@/components/landing/StatsBand";
import TeamsGrid from "@/components/landing/TeamsGrid";
import Testimonials from "@/components/landing/Testimonials";
import ClosingCta from "@/components/landing/ClosingCta";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {

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
