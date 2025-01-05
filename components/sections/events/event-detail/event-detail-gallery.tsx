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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Small Images */}
        <div className="space-y-4">
          {/* Render Sponsor Logos */}
          {event?.sponsors &&
            event.sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-lg overflow-hidden h-[140px]"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailGallery;
