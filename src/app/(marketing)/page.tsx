import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { SocialProofSection } from "@/components/marketing/landing/SocialProofSection";
import { FeatureSection } from "@/components/marketing/landing/FeatureSection";
import { DeveloperSection } from "@/components/marketing/landing/DeveloperSection";
import { CTASection } from "@/components/marketing/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <FeatureSection />
      <DeveloperSection />
      <CTASection />
    </>
  );
}
