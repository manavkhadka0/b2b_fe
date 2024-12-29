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
    <>
      <EventsFeaturedSection featuredEvents={featuredEvents} />

      <EventGridSection eventsResponse={eventsResponse} />
    </>
  );
};
