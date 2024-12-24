import { EventGridSection } from "../events-list/event-grid-section";
import { EventsListHeroSection } from "../events-list/events-list-hero-section";
import type { Event, EventResponse } from "@/types/events";

interface EventsListViewProps {
  eventsResponse: EventResponse;
}

export const EventsListView = ({ eventsResponse }: EventsListViewProps) => {
  return (
    <div>
      <EventsListHeroSection />
      <EventGridSection eventsResponse={eventsResponse} />
    </div>
  );
};
