import HeroSection from "@/components/sections/events/featuredEvents/featuredEventsList/featuredHero";
import ViewSection from "@/components/sections/events/featuredEvents/featuredEventsList/featuredList";
import { EventResponse } from "@/types/events";
import { ResponsiveContainer } from "../../common/responsive-container";
import { HeaderSubtitle } from "../../common/header-subtitle";

interface EventsFeaturedSectionProps {
  featuredEvents: EventResponse;
}

const EventsFeaturedSection = async ({
  featuredEvents,
}: EventsFeaturedSectionProps) => {
  const events = featuredEvents.results;

  if (!events.length) {
    return (
      <p className="text-center text-red-500">Failed to load Event data.</p>
    );
  }

  const mainEvent = events[0];
  const sideEvents = events.slice(1, 3); // Next two events for side cards

  return (
    <ResponsiveContainer className="space-y-6">
      <HeaderSubtitle
        title="Featured Events"
        subtitle="Check out our latest events"
      />
      <div
        className={`grid grid-cols-1 gap-6 ${
          sideEvents.length > 0 ? "lg:grid-cols-3" : ""
        }`}
      >
        <HeroSection
          mainEvent={mainEvent}
          hasSideEvents={sideEvents.length > 0}
        />

        {sideEvents.length > 0 && <ViewSection sideEvents={sideEvents} />}
      </div>
    </ResponsiveContainer>
  );
};

export default EventsFeaturedSection;
