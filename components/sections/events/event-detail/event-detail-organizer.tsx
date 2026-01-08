import { Event, Sponsor } from "@/types/events";
import { Globe, Mail } from "lucide-react";
import ShareButtons from "@/components/ui/shareButton";

const EventDetailOrganizer = ({ event }: { event: Event }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 border border-gray-100">
      {/* Organizer Section */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-4">Event Organizer</h2>
        <div className="flex items-center gap-4">
          {event?.organizer?.avatar && (
            <img
              src={event.organizer.avatar}
              alt={`${event.organizer.username}'s avatar`}
              className="w-12 h-12 object-cover rounded-full border-2 border-gray-100"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">
              {event?.organizer?.first_name
                ? `${event?.organizer?.first_name} ${event?.organizer?.last_name}`
                : event?.organizer?.username}
            </h3>
            {event?.organizer?.email && (
              <p className="flex items-center text-gray-600 text-sm mt-1">
                <Mail className="w-4 h-4 mr-2" />
                <span>{event.organizer.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Event Sponsors</h2>
        {/* {event?.sponsors && event.sponsors.length > 0 ? (
          <div className="grid gap-6">
            {event.sponsors.map((sponsor: Sponsor) => (
              <div
                key={sponsor.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {sponsor.logo && (
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{sponsor.name}</h4>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        <span>{new URL(sponsor.website).hostname}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No sponsors are currently listed for this event.
          </p>
        )} */}
        <p className="text-gray-500 italic">
          No sponsors are currently listed for this event.
        </p>
      </div>

      {/* Share Section */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Share This Event
        </h3>
        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}`}
          title={event.title}
          description={event.description}
        />
      </div>
    </div>
  );
};

export default EventDetailOrganizer;
