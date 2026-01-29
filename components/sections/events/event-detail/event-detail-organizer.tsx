import { Event, Sponsor } from "@/types/events";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import ShareButtons from "@/components/ui/shareButton";

const EventDetailOrganizer = ({ event }: { event: Event }) => {
  const organizer = event?.event_organizer;

  if (!organizer) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 border border-gray-100">
      {/* Organizer Section */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-4">Event Organizer</h2>
        <div className="flex items-start gap-4">
          {organizer.logo && (
            <img
              src={organizer.logo}
              alt={`${organizer.name} logo`}
              className="w-16 h-16 object-contain rounded-full border-2 border-gray-100 flex-shrink-0"
            />
          )}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">{organizer.name}</h3>
            {organizer.email && (
              <p className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-words">{organizer.email}</span>
              </p>
            )}
            {organizer.phone && (
              <p className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{organizer.phone}</span>
              </p>
            )}
            {organizer.address && (
              <p className="flex items-start text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="break-words">{organizer.address}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Event Sponsors</h2>
        {event?.sponsors && event.sponsors.length > 0 ? (
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
        )}
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
