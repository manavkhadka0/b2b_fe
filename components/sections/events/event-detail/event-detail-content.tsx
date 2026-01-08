import { Event } from "@/types/events";
import EventDetailAbout from "./event-detail-about";
import EventDetailAgenda from "./event-detail-agenda";
import EventDetailGallery from "./event-detail-gallery";
import EventWishesSection from "./event-wishes-section";
import EventOffersSection from "./event-offers-section";
import { ResponsiveContainer } from "../../common/responsive-container";

const EventDetailContent = ({ event }: { event: Event }) => {
  return (
    <ResponsiveContainer className="space-y-14 py-10">
      <div className="space-y-8">
        <EventDetailAbout event={event} />
        <EventDetailAgenda event={event} />
      </div>
      <EventDetailGallery event={event} />
      <EventWishesSection />
      <EventOffersSection />
    </ResponsiveContainer>
  );
};

export default EventDetailContent;
