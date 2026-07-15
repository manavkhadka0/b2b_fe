import { getEventBySlug } from "@/services/events";
import { DataNotFound } from "@/components/sections/errors/data-not-found";
import EventDetailView from "@/components/sections/events/view/event-detail-view";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found | BiratBazar",
    };
  }

  return {
    title: `${event.title} | BiratBazar`,
    description: event.description || `Join ${event.title} networking event.`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.thumbnail ? [event.thumbnail] : [],
    },
  };
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
