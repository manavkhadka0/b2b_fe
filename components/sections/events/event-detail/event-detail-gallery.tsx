import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";

const EventDetailGallery = ({ event }: { event: Event }) => {
  return (
    <div className="space-y-6">
      <HeaderSubtitle
        title="Event Photos and Videos"
        subtitle="Check out photos and videos from the event"
      />

      {/* Grid Layout */}
      <div className="">
        {/* Large Main Image */}
        {event?.thumbnail && (
          <div className="md:col-span-2 rounded-lg overflow-hidden h-[300px]">
            <img
              src={event.thumbnail}
              alt="Main Event"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailGallery;
