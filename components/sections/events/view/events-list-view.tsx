import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";
import { CimZoneSection } from "../cim-zone-section";

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

      <CimZoneSection />

      <EventGridSection
        eventsResponse={pastEventsResponse}
        title="Past B2B Networking Events"
        subtitle="Explore our successful past events"
        hideAttendButton={true}
      />
    </>
  );
};
