import { Event } from "@/types/events";
import EventDetailHero from "../event-detail/event-detail-hero";
import EventDetailContent from "../event-detail/event-detail-content";

export default function EventDetailView({ event }: { event: Event }) {
  return (
    <>
      <EventDetailHero event={event} />
      <EventDetailContent event={event} />
    </>
  );
}
