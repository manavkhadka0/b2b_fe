import { EventsListView } from "@/components/sections/events/view/events-list-view";
import { getEvents } from "@/services/events";

export const revalidate = 10;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const eventsResponse = await getEvents(searchParams.page);

  return <EventsListView eventsResponse={eventsResponse} />;
}
