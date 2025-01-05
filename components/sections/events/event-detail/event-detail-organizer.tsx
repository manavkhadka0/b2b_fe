import { Event, Sponsor } from "@/types/events";
import { Globe, Mail, Phone } from "lucide-react";
import ShareButtons from "@/components/ui/shareButton";

const EventDetailOrganizer = ({ event }: { event: Event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold flex items-center space-x-2">
        {event?.sponsors && event.sponsors.length > 0 && (
          <img
            src={event.sponsors[0].logo}
            alt={event.sponsors[0].name}
            className="w-8 h-8 object-contain rounded-full"
          />
        )}
        <span>Event Organizer</span>
      </h3>
      {event?.sponsors && event.sponsors.length > 0 ? (
        event.sponsors.map((sponsor: Sponsor) => (
          <div key={sponsor.id} className="mt-4">
            <p className="text-gray-800 font-semibold">{sponsor.name}</p>
            <p className="text-gray-500">{sponsor.location || "N/A"}</p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+977 9800000000, 01-525252</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>chamberofmorang@gmail.com</span>
              </p>
              <p className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {sponsor.website}
                </a>
              </p>
            </div>

            <div className="flex space-x-4 mt-4">
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}`}
                title={event.title}
                description={event.description}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No sponsors available for this event.</p>
      )}
    </div>
  );
};

export default EventDetailOrganizer;
