import { ResponsiveContainer } from "../../common/responsive-container";
import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";
import EventsFeaturedSection from "@/components/sections/events/featuredEvents/featured-event-section";
import { HeaderSubtitle } from "../../common/header-subtitle";

interface EventsListViewProps {
  eventsResponse: EventResponse;
  featuredEvents: EventResponse;
}

export const EventsListView = ({
  eventsResponse,
  featuredEvents,
}: EventsListViewProps) => {
  return (
    <ResponsiveContainer className="space-y-8">
      <HeaderSubtitle
        title="Featured Events"
        subtitle="See the latest featured events in your area"
      />
      <EventsFeaturedSection featuredEvents={featuredEvents} />
      <HeaderSubtitle
        title="Popular Events"
        subtitle="Attend the most popular events in your area"
      />
      <EventGridSection eventsResponse={eventsResponse} />
    </ResponsiveContainer>
  );
};
