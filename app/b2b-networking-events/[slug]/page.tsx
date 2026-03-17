import { getEventBySlug, getEvents } from "@/services/events";
import { DataNotFound } from "@/components/sections/errors/data-not-found";
import EventDetailView from "@/components/sections/events/view/event-detail-view";

export const dynamicParams = true;
export const revalidate = 10;

export async function generateStaticParams() {
  const events = await getEvents("1");
  return events.results.map((event) => ({ slug: event.slug }));
}

const EventDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <DataNotFound
        title="Event Not Found"
        message="The event you are looking for does not exist."
      />
    );
  }

  return <EventDetailView event={event} />;
};

export default EventDetailPage;
