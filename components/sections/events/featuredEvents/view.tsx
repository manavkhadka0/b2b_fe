import HeroSection from "@/components/sections/events/featuredEvents/featuredEventsList/featuredHero";
import ViewSection from "@/components/sections/events/featuredEvents/featuredEventsList/featuredList";
import { EventResponse } from "@/types/events";

async function fetchEvents(): Promise<EventResponse["results"]> {
  try {
    const response = await fetch(
      "http://128.199.18.200/api/events/featured-events/",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: EventResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch event data:", error);
    return [];
  }
}

const FeaturedEvents = async () => {
  const events = await fetchEvents();

  if (!events.length) {
    return (
      <p className="text-center text-red-500">Failed to load Event data.</p>
    );
  }

  const mainEvent = events[0];
  const sideEvents = events.slice(1, 3); // Next two events for side cards

  return (
    <div className="py-6 container max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Featured Events</h2>
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
    </div>
  );
};

export default FeaturedEvents;
