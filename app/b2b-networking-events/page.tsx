import { EventsListView } from "@/components/sections/events/view/events-list-view";
import { getEvents, getPastEvents } from "@/services/events";

export const revalidate = 10;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const eventsResponseRequest = getEvents(searchParams.page);
  const pastEventsResponseRequest = getPastEvents(searchParams.page);

  const [eventsResponse, pastEventsResponse] = await Promise.all([
    eventsResponseRequest,
    pastEventsResponseRequest,
  ]);

  return (
    <EventsListView
      eventsResponse={eventsResponse}
      pastEventsResponse={pastEventsResponse}
    />
  );
}
