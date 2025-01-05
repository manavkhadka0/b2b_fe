import { Event } from "@/types/events";
import EventDetailAbout from "./event-detail-about";
import EventDetailAgenda from "./event-detail-agenda";
import EventDetailOrganizer from "./event-detail-organizer";
import EventDetailGallery from "./event-detail-gallery";
import EventWishesSection from "./event-wishes-section";
import EventOffersSection from "./event-offers-section";
import { ResponsiveContainer } from "../../common/responsive-container";

const EventDetailContent = ({ event }: { event: Event }) => {
  return (
    <ResponsiveContainer className="space-y-14 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-8">
          <EventDetailAbout event={event} />
          <EventDetailAgenda event={event} />
        </div>

        {/* Right Section */}
        <div>
          <EventDetailOrganizer event={event} />
        </div>
      </div>
      <EventDetailGallery event={event} />
      <EventWishesSection event={event} />
      <EventOffersSection event={event} />
    </ResponsiveContainer>
  );
};

export default EventDetailContent;
