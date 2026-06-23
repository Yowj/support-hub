import Hero from "./_components/landing/Hero";
import TrustStrip from "./_components/landing/TrustStrip";
import FeatureHighlight from "./_components/landing/FeatureHighlight";
import FeatureGrid from "./_components/landing/FeatureGrid";
import StatsBand from "./_components/landing/StatsBand";
import TeamsGrid from "./_components/landing/TeamsGrid";
import Testimonials from "./_components/landing/Testimonials";
import ClosingCta from "./_components/landing/ClosingCta";
import LandingFooter from "./_components/landing/LandingFooter";

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
