import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";
import { ResponsiveContainer } from "../../common/responsive-container";

interface EventsListViewProps {
  eventsResponse: EventResponse;
  pastEventsResponse: EventResponse;
}

export const EventsListView = ({
  eventsResponse,
  pastEventsResponse,
}: EventsListViewProps) => {
  return (
    <>
      <EventGridSection eventsResponse={eventsResponse} />

      <EventGridSection
        eventsResponse={pastEventsResponse}
        title="Past B2B Networking Events"
        subtitle="Explore our successful past events"
        hideAttendButton={true}
      />
    </>
  );
};
