import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
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
    <div className="min-h-screen p-6 container mx-auto">
      <div
        className="relative w-full h-80 bg-no-repeat bg-center bg-cover mb-6 rounded-lg"
        style={{ backgroundImage: `url(${event.thumbnail || "/event.svg"})` }}
      ></div>

      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md p-6 max-w-4xl w-full mx-auto">
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex items-center text-gray-600 space-x-2">
            <MapPin />
            <p>{event.location}</p>
          </div>
          <div className="flex items-center text-gray-600 space-x-2">
            <BsCalendar2Date />
            <p>{new Date(event.start_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-4">About the Event</h2>
        <p className="text-gray-600 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
};

export default EventDetailPage;
