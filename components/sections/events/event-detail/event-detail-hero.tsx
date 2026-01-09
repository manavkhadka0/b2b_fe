import type { Attendee, Event } from "@/types/events";
import { Calendar, Clock, MapIcon, Phone } from "lucide-react";
import ShareButtons from "@/components/ui/shareButton";
import ParticipateSection from "@/app/ParticipateModal";
import EventDetailOrganizer from "./event-detail-organizer";
import { ResponsiveContainer } from "../../common/responsive-container";
import EventDetailAbout from "./event-detail-about";
import EventDetailAgenda from "./event-detail-agenda";
import EventDetailGallery from "./event-detail-gallery";
import EventWishesSection from "./event-wishes-section";
import EventOffersSection from "./event-offers-section";
import AttendeesList from "./attendees-list";

// Helper function to extract date part from "Poush 27, 2082 10:00 AM" format
const extractDate = (dateTimeString: string): string => {
  if (!dateTimeString) return "";
  // Match pattern: date part ends before time (HH:MM AM/PM)
  const match = dateTimeString.match(/^(.+?)\s+\d{1,2}:\d{2}\s+(AM|PM)$/);
  return match ? match[1].trim() : dateTimeString;
};

// Helper function to extract time part from "Poush 27, 2082 10:00 AM" format
const extractTime = (dateTimeString: string): string => {
  if (!dateTimeString) return "";
  // Match pattern: time part (HH:MM AM/PM)
  const match = dateTimeString.match(/(\d{1,2}:\d{2}\s+(AM|PM))$/);
  return match ? match[1] : "";
};

// Event Header Component
const EventHeader = ({ thumbnail }: { thumbnail?: string }) => (
  <div className="w-full rounded-xl overflow-hidden bg-gray-100 mt-8">
    <img
      src={thumbnail || "/event.svg"}
      alt="Event banner"
      className="w-full h-auto max-h-[480px] object-cover"
    />
  </div>
);

// Event Info Card Component
const EventInfoCard = ({ event }: { event: Event }) => (
  <div className="bg-white rounded-lg md:rounded-xl py-4">
    <div className="space-y-4 md:space-y-5">
      {/* Event Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
        {event?.title}
      </h1>

      {/* Event Details */}
      <EventDetails event={event} />

      {/* Contact Info */}
      <ContactInfo event={event} />

      {/* Sponsor Section */}
      <SponsorSection sponsors={event?.sponsors} />
    </div>

    {/* Bottom Section */}
    <div className="mt-6 pt-4 border-t border-gray-200">
      <AttendeesList />
    </div>
  </div>
);

// Event Details Component
const EventDetails = ({ event }: { event: Event }) => (
  <div className="space-y-3 text-gray-700">
    {event?.location && (
      <div className="flex items-start gap-3">
        <MapIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm md:text-base leading-relaxed">{event.location}</p>
      </div>
    )}
    {event?.start_date && (
      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm md:text-base leading-relaxed">
          {extractDate(event.start_date)}
        </p>
      </div>
    )}
    {(event?.start_date || event?.end_date) && (
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm md:text-base leading-relaxed">
          {event?.start_date
            ? extractTime(event.start_date) || "Time not available"
            : "Time not available"}
          {event?.end_date
            ? ` - ${extractTime(event.end_date) || extractDate(event.end_date)}`
            : ""}
        </p>
      </div>
    )}
  </div>
);

// Contact Info Component
const ContactInfo = ({ event }: { event: Event }) => {
  if (!event?.contact_person && !event?.contact_number) return null;

  return (
    <div className="flex items-start gap-3 text-gray-700">
      <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <p className="text-sm md:text-base leading-relaxed">
        {event?.contact_person && (
          <>
            {event.contact_person}
            {event?.contact_number && " - "}
          </>
        )}
        {event?.contact_number}
      </p>
    </div>
  );
};

// Sponsor Section Component
const SponsorSection = ({ sponsors }: { sponsors?: Event["sponsors"] }) => {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="flex flex-col space-y-3 pt-2">
      <h3 className="text-gray-600 text-sm md:text-base font-medium">
        In Association with
      </h3>
      <div className="flex items-center gap-3">
        <a
          href={sponsors[0]?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md overflow-hidden bg-white flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
            <img
              src={sponsors[0]?.logo}
              alt={sponsors[0]?.name}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>
          <p className="text-sm md:text-base font-semibold text-gray-900">
            {sponsors[0]?.name}
          </p>
        </a>
      </div>
    </div>
  );
};

// Share Section Component
const ShareSection = ({ event }: { event: Event }) => (
  <div className="flex flex-col items-start md:items-center space-y-2">
    <p className="text-sm text-gray-600">Share with Friends</p>
    <ShareButtons
      url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${event.slug}`}
      title={event.title || "Amazing Event"}
      description={event.description || "Join us for an amazing event!"}
    />
  </div>
);

// Main Event Detail View Component
const EventDetailHero = ({ event }: { event: Event }) => {
  return (
    <ResponsiveContainer>
      <div className="space-y-6 md:space-y-8">
        <EventHeader thumbnail={event?.thumbnail} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
          {/* Left Column - Event Info Card */}
          <div className="md:col-span-2 space-y-6 md:space-y-20">
            <EventInfoCard event={event} />
            <EventDetailAbout event={event} />
            <EventDetailAgenda event={event} />
            <EventDetailGallery event={event} />
            <EventWishesSection />
            <EventOffersSection />
          </div>

          {/* Right Column - Sticky Organizer and Participate Section */}
          <div className="sticky top-24 space-y-6">
            <EventDetailOrganizer event={event} />
            <ParticipateSection />
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default EventDetailHero;
