import ShareButtons from "@/components/ui/shareButton";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { notFound } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import ParticipateSection from "@/app/ParticipateModal";
import {
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event, Attendee, Sponsor } from "@/types/events";
import { formatDateTime } from "@/lib/utils";

// Fetch event data
async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!slug || slug.includes(".")) {
    console.error("Invalid slug:", slug);
    return null;
  }

  try {
    const response = await axios.get<Event>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/${slug}/`,
      { headers: { Accept: "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch event with slug ${slug}:`, error);
    return null;
  }
}

const EventDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen  p-6 container mx-auto">
      {/* Header Section */}
      <div
        className="relative w-full h-80 bg-no-repeat bg-center bg-cover mb-6 rounded-lg"
        style={{
          backgroundImage: `url('${event?.thumbnail || "/event.svg"}')`,
        }}
      ></div>

      <div className="absolute inset-5 flex items-center justify-center">
        <div className="grid grid-cols-3 bg-white rounded-lg shadow-md p-6 max-w-4xl w-full gap-4">
          {/* Top Right Section: Title, Location, Date, Time */}
          <div className="col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{event?.title}</h1>
            <div className="text-gray-600 space-y-2">
              {/* Location */}
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-lg" />
                <p>{event?.location?.split(" ").slice(0, 3).join(" ")}</p>
              </div>
              {/* Start Date */}
              <div className="flex items-center space-x-2">
                <BsCalendar2Date className="text-lg" />
                <p>
                  {event?.start_date
                    ? formatDateTime(event.start_date, "EEE, MMM d yyyy")
                    : "Date not available"}
                </p>
              </div>
              {/* Time */}
              <div className="flex items-center space-x-2">
                <FaRegClock className="text-lg" />
                <p>
                  {event?.start_date
                    ? formatDateTime(event.start_date, "hh:mm a")
                    : "Time not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section: Contact and End Date */}
          <div className="col-span-1 space-y-4 mt-11 text-gray-500">
            {/* Contact */}
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-lg" />
              <p>{event?.organizer?.phone_number || "Contact not available"}</p>
            </div>
            {/* End Date */}
            <div className="flex items-center space-x-2">
              <BsCalendar2Date className="text-lg" />
              <p>
                {event?.end_date
                  ? formatDateTime(event.start_date, "EEE, MMM d yyyy")
                  : "Date not available"}
              </p>
            </div>
          </div>

          {/* Left Section: Logo, Sponsor, Apply Button */}
          <div className="col-span-1 flex flex-col items-center space-y-4 text-center">
            {/* Section Title */}
            <p className="text-gray-500">In Association with</p>

            {/* Sponsor Section */}
            {event?.sponsors && event.sponsors.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Sponsor Logo */}
                <a
                  href={event.sponsors[0]?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full shadow-lg overflow-hidden">
                    <img
                      src={event.sponsors[0]?.logo}
                      alt={event.sponsors[0]?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Organizer Name */}
                  <p className="text-md text-gray-800 mt-3 font-bold">
                    {event.sponsors[0]?.name}
                  </p>
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No sponsors available</p>
            )}
          </div>

          {/* Bottom Row: Attendees, Share, Apply Button */}
          <div className="col-span-3 flex justify-between items-center">
            {/* Bottom Left: Attendees */}
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {event?.attendees?.slice(0, 3).map((attendee: Attendee) => (
                  <img
                    key={attendee.user.id}
                    src={attendee.user.avatar}
                    alt={attendee.user.username || "Attendee"}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  />
                ))}
              </div>
              <span>
                <strong>{event?.attendees?.length || 0} People Enrolled</strong>
              </span>
            </div>

            {/* Bottom Middle: Share Options */}
            {/* Bottom Middle: Share Options */}
            {/* Bottom Middle: Share Options */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-gray-600">Share with Friends</p>
              <ShareButtons
                url={event.url || "https://your-default-event-url.com"}
                title={event.title || "Amazing Event"}
                description={
                  event.description || "Join us for an amazing event!"
                }
              />
            </div>

            <div>
              <ParticipateSection />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-10">
          {/* Event Description */}
          <div className="bg-white rounded-lg   ">
            <h2 className="text-xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-600 leading-relaxed">
              {event?.description}
            </p>
            <br />
            <p className="text-gray-600 leading-relaxed">
              This meetup allows attendees to pitch their business ideas,
              connect with investors, and showcase their work. In addition,
              industry experts will share insights into market trends, growth
              strategies, and solutions for business needs.
            </p>
          </div>
          <h2 className="text-xl font-bold mb-4">
            Event Agenda and Responsibilities
          </h2>
          <div className="bg-white rounded-lg p-6 shadow ">
            <Table>
              <TableCaption>Event Agenda and Responsibilities</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Time</TableHead>
                  <TableHead>Topic to be discussed</TableHead>
                  <TableHead className="text-right">Speakers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event?.agenda_items && event.agenda_items.length > 0 ? (
                  event.agenda_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.time}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-gray-600">
                          <p className="font-bold">{item.title}</p>
                          <div className="ml-3">
                            <li>{item.description}</li>
                          </div>
                        </ul>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {item.speaker}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      No agenda items available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                {event?.sponsors && event.sponsors.length > 0 && (
                  <img
                    src={event.sponsors[0].logo} // Use the first sponsor's logo
                    alt={event.sponsors[0].name}
                    className="w-8 h-8 object-contain rounded-full"
                  />
                )}
                <span>Event Organizer</span>
              </h3>
              {event?.sponsors && event.sponsors.length > 0 ? (
                event.sponsors.map((sponsor: Sponsor) => (
                  <div key={sponsor.id}>
                    <p className="text-gray-800 font-semibold">
                      {sponsor.name}
                    </p>
                    <p className="text-gray-500">{sponsor.location || "N/A"}</p>
                    <div className="mt-4 space-y-2 text-gray-600">
                      <p>
                        <FaPhoneAlt className="inline mr-2" /> +977 9800000000,
                        01-525252
                      </p>
                      <p>
                        <FaEnvelope className="inline mr-2" />{" "}
                        chamberofmorang@gmail.com
                      </p>
                      <p>
                        <FaGlobe className="inline mr-2" />
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          {sponsor.website}
                        </a>
                      </p>
                    </div>

                    {/* Social Media Buttons */}
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                        aria-label="Facebook"
                      >
                        <FaFacebook />
                      </button>
                      <button
                        className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600"
                        aria-label="Instagram"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500"
                        aria-label="Twitter"
                      >
                        <FaTwitter />
                      </button>
                      <button
                        className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No sponsors available for this event.
                </p>
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg ">
            <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["Technology", "Health and Wellness", "Travel"].map(
                (tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-10">
        {/* Title */}
        <div className="text-2xl font-bold mb-6">Event Photos and Videos</div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large Main Image */}
          {event?.thumbnail && (
            <div className="md:col-span-2 rounded-lg overflow-hidden">
              <Image
                src={event.thumbnail} // Dynamic thumbnail from API
                alt="Main Event"
                layout="responsive"
                width={700}
                height={450}
                className="object-cover"
              />
            </div>
          )}

          {/* Small Images */}
          <div className="space-y-4">
            {/* Render Sponsor Logos */}
            {event?.sponsors &&
              event.sponsors.map((sponsor) => (
                <div key={sponsor.id} className="rounded-lg overflow-hidden">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    layout="responsive"
                    width={150}
                    height={100}
                    className="object-cover"
                  />
                </div>
              ))}

            {/* Render Attendee Avatars */}
            {event?.attendees &&
              event.attendees.map((attendee) => (
                <div key={attendee.id} className="rounded-lg overflow-hidden">
                  <Image
                    src={attendee.user.avatar}
                    alt={attendee.user.username}
                    layout="responsive"
                    width={150}
                    height={100}
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className=" container mx-auto mt-10">
        {/* Wishes and Offers Section */}
        <div className="container mx-auto mt-10">
          {/* Wishes Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Wishes</h2>
            {event?.wishes && event.wishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <h3 className="font-bold text-lg mb-2">{wish.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600 border border-blue-600 rounded-full px-2 py-1 text-xs font-medium">
                        {wish.wish_type}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {wish.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {wish.product
                        ? `Product ID: ${wish.product}`
                        : wish.service
                        ? `Service ID: ${wish.service}`
                        : "No additional details available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No wishes available for this event.
              </p>
            )}
          </div>

          {/* Offers Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Offers</h2>
            {event?.offers && event.offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600 border border-blue-600 rounded-full px-2 py-1 text-xs font-medium">
                        {offer.offer_type}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {offer.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {offer.product
                        ? `Product ID: ${offer.product}`
                        : offer.service
                        ? `Service ID: ${offer.service}`
                        : "No additional details available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No offers available for this event.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
