import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import { BsCalendar2Date } from "react-icons/bs";
import axios from "axios";
import { Event } from "@/types/events";

async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!slug || slug.includes(".")) {
    console.error("Invalid slug:", slug);
    return null;
  }

  try {
    const response = await axios.get<Event>(
      `https://1662-111-119-49-122.ngrok-free.app/api/events/events/${slug}/`,
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
    <div className="min-h-screen bg-gray-50">
      {/* Event Banner */}
      <div className="relative w-full h-96 bg-gray-800">
        <Image
          src={event.thumbnail || "/placeholder-banner.jpg"}
          alt={event.title}
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <p className="text-lg">{event.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <BsCalendar2Date className="w-5 h-5" />
              <p className="text-lg">
                {new Date(event.start_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Left Section */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">About the Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-6">
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-bold">Event Organizer</h3>
              <p className="text-gray-600 mt-2">{event.organizer.username}</p>
              <p className="text-gray-600">
                {event.organizer.phone_number || "N/A"}
              </p>
              <p className="text-gray-600">{event.organizer.email}</p>
              <div className="flex space-x-2 mt-4">
                <a href="#" className="text-blue-600 hover:underline">
                  Facebook
                </a>
                <a href="#" className="text-blue-600 hover:underline">
                  Twitter
                </a>
                <a href="#" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
                <a href="#" className="text-blue-600 hover:underline">
                  Instagram
                </a>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
