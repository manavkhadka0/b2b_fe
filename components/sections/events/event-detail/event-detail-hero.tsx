import type { Attendee, Event } from "@/types/events";
import { Calendar, Clock, MapIcon, Phone } from "lucide-react";
import ShareButtons from "@/components/ui/shareButton";
import ParticipateSection from "@/app/ParticipateModal";
import { ResponsiveContainer } from "../../common/responsive-container";

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
  <div className="relative w-full">
    {/* Aspect ratio container - adjusted for different screen sizes */}
    <div className="relative w-full aspect-[3/2] sm:aspect-[3/1.5] md:aspect-[4/1.5] lg:aspect-[4/1]">
      {/* Image container */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${
            thumbnail || "/event.svg"
          }')`,
        }}
      />
    </div>
  </div>
);

// Event Info Card Component
const EventInfoCard = ({ event }: { event: Event }) => (
  <div className="relative -mt-6 sm:-mt-12 md:-mt-24 lg:-mt-14 mx-3 md:mx-0">
    <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] md:gap-6 lg:gap-8">
        {/* Event Details */}
        <div className="space-y-[10px] md:space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {event?.title}
          </h1>
          <EventDetails event={event} />
        </div>

        {/* Contact & Schedule */}
        <div className="space-y-[10px] md:space-y-4">
          <ContactInfo event={event} />
          <ScheduleInfo event={event} />
        </div>

        {/* Sponsor Section */}
        <SponsorSection sponsors={event?.sponsors} />
      </div>

      {/* Bottom Section */}
      <div className="mt-4 sm:mt-6 md:mt-3 pt-3 sm:pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
        <AttendeesList attendees_count={event?.attendees_count} />
        <div className="flex justify-start md:justify-end md:col-start-3 w-full">
          <ParticipateSection event={event} />
        </div>
      </div>
    </div>
  </div>
);

// Event Details Component
const EventDetails = ({ event }: { event: Event }) => (
  <div className="text-gray-600 space-y-2 md:space-y-3">
    <div className="flex items-center space-x-2 md:space-x-3">
      <MapIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
      <p className="text-sm md:text-base">{event?.location}</p>
    </div>
    <div className="flex items-center space-x-2 md:space-x-3">
      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
      <p className="text-sm md:text-base">
        {event?.start_date
          ? extractDate(event.start_date)
          : "Date not available"}
      </p>
    </div>
    <div className="flex items-center space-x-2 md:space-x-3">
      <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
      <p className="text-sm md:text-base">
        {event?.start_date
          ? extractTime(event.start_date) || "Time not available"
          : "Time not available"}
      </p>
    </div>
  </div>
);

// Contact Info Component
const ContactInfo = ({ event }: { event: Event }) => (
  <div className="flex items-center space-x-2 md:space-x-3 text-gray-600">
    <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
    <p className="text-sm md:text-base">
      {event?.contact_person || "Contact not available"} -{" "}
      {event?.contact_number || "Contact not available"}
    </p>
  </div>
);

// Schedule Info Component
const ScheduleInfo = ({ event }: { event: Event }) => (
  <div className="flex items-center space-x-2 md:space-x-3 text-gray-600">
    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
    <p className="text-sm md:text-base">
      {event?.end_date
        ? `Ends: ${extractTime(event.end_date) || extractDate(event.end_date)}`
        : "End date not available"}
    </p>
  </div>
);

// Sponsor Section Component
const SponsorSection = ({ sponsors }: { sponsors?: Event["sponsors"] }) => (
  <div className="flex flex-col items-start md:items-end space-y-2 md:space-y-4">
    <h3 className="text-gray-600 text-sm md:text-base font-medium">
      In Association with
    </h3>
    {sponsors && sponsors.length > 0 ? (
      <div className="flex flex-col items-start md:items-center">
        <a
          href={sponsors[0]?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start md:items-center"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg overflow-hidden bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src={sponsors[0]?.logo}
              alt={sponsors[0]?.name}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>
          <p className="text-center mt-2 md:mt-3 text-sm md:text-base font-semibold text-gray-900">
            {sponsors[0]?.name}
          </p>
        </a>
      </div>
    ) : (
      <p className="text-gray-500 text-sm md:text-base">
        No sponsors available
      </p>
    )}
  </div>
);

// Attendees List Component
const AttendeesList = ({
  attendees_count,
}: {
  attendees_count?: Event["attendees_count"];
}) => (
  <span className="text-xs md:text-sm font-medium text-gray-900">
    {attendees_count || 0} People Enrolled
  </span>
);

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
    <div className="">
      <EventHeader thumbnail={event?.thumbnail} />
      <ResponsiveContainer>
        <EventInfoCard event={event} />
      </ResponsiveContainer>
    </div>
  );
};

export default EventDetailHero;
