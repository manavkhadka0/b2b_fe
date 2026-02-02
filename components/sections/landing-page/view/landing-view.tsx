import HeroSection from "../hero-section";
import ObjectivesSection from "../objectives-section";
import PlatformFeatures from "../platform-features";
import WishOfferDescription from "../wish-offer-description";
import HowItWorks from "../how-it-works";
import WishOfferSection from "../wish-offer-section";

export default function LandingView() {
  return (
    <>
      <WishOfferSection />
      <HeroSection />
      <ObjectivesSection />
      <PlatformFeatures />
      <WishOfferDescription />
      <HowItWorks />
    </>
  );
}
