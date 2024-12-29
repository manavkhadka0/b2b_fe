import HeroSection from "../hero-section";
import EventsFeaturedSection from "@/components/sections/events/featuredEvents/featured-event-section";
import { EventResponse } from "@/types/events";

interface LandingViewProps {
  featuredEvents: EventResponse;
}

export default function LandingView({ featuredEvents }: LandingViewProps) {
  return (
    <>
      <HeroSection />
      <EventsFeaturedSection featuredEvents={featuredEvents} />
    </>
  );
}
