import { EventsListView } from "@/components/sections/events/view/events-list-view";
import { fetchFeaturedEvents, getEvents } from "@/api-calls/events";

export const revalidate = 10;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const eventsResponse = await getEvents(searchParams.page);
  const featuredEvents = await fetchFeaturedEvents();
  return (
    <EventsListView
      eventsResponse={eventsResponse}
      featuredEvents={featuredEvents}
    />
  );
}
