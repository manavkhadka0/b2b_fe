import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { notFound } from "next/navigation";
import axios from "axios";
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
import { Event } from "@/types/events";
import { any } from "zod";

async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!slug || slug.includes(".")) {
    console.error("Invalid slug:", slug);
    return null;
  }

  try {
    const response = await axios.get<Event>(
      `${process.env.BASE_URL}/api/events/events/${slug}/`,
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
        style={{ backgroundImage: "url('/event.svg')" }}
      ></div>

      <div className="absolute inset-5 flex items-center justify-center ">
        <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md p-6 max-w-4xl w-full">
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">{event?.title}</h1>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaMapMarkerAlt />
              <p>{event?.location}</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaPhoneAlt />
              <p>01-525252, +977 9800000000</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <BsCalendar2Date />
              <p>{event?.start_date}</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              <FaRegClock />
              <p>{event?.end_date}</p>
            </div>
            <p className="text-gray-600">
              <strong>{event?.attendees_count} People Enrolled</strong>
            </p>
          </div>

          {/* Right Side */}
          <div className="sm:w-1/3 flex flex-col items-center space-y-4">
            <p className="text-gray-500">In Association with</p>
            {event?.sponsors && event.sponsors.length > 0 ? (
              event.sponsors.map((sponsor: Sponsor) => (
                <div key={sponsor.id} className="text-center">
                  <div className="mt-4">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center"
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-16 h-16 object-cover mx-auto rounded-lg shadow-lg" // Smaller dimensions
                      />
                      <p className="text-sm text-gray-700 mt-2 font-semibold">
                        {sponsor.name}
                      </p>{" "}
                      {/* Small sponsor name */}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No sponsors available for this event.
              </p>
            )}
            <Link href={"/events/create-event"}>
              <button className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700">
                Apply Now →
              </button>
            </Link>
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
        <div className="text-2xl font-bold mb-6">Explore Similar Events</div>
      </div>
    </div>
  );
};

export default EventDetailPage;
