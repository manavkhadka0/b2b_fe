import { EventsListView } from "@/components/sections/events/view/events-list-view";
import { getEvents, getPastEvents } from "@/services/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B Networking Events | BiratBazar",
  description:
    "Join exclusive B2B networking events to connect with business leaders and entrepreneurs. Grow your network and business opportunities.",
  keywords: ["B2B", "Events", "Networking", "Business Nepal", "BiratBazar"],
};

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
