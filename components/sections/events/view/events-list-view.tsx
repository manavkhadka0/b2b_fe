import EventDetailContent from "../event-detail/event-detail-content";
import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";

interface EventsListViewProps {
  eventsResponse: EventResponse;
}

export const EventsListView = ({ eventsResponse }: EventsListViewProps) => {
  return (
    <>
      <EventGridSection eventsResponse={eventsResponse} />
    </>
  );
};
