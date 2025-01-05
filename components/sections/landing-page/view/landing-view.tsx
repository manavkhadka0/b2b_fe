import HeroSection from "../hero-section";
import EventsFeaturedSection from "@/components/sections/events/featuredEvents/featured-event-section";
import WishOfferDescription from "../wish-offer-description";
import AboutUs from "../about-us";
import { EventResponse } from "@/types/events";

interface LandingViewProps {
  featuredEvents: EventResponse;
}

export default function LandingView({ featuredEvents }: LandingViewProps) {
  return (
    <>
      <HeroSection />
      <WishOfferDescription />
      <AboutUs />
      {/* <EventsFeaturedSection featuredEvents={featuredEvents} /> */}
    </>
  );
}
