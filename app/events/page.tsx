import React from "react";
import axios from "axios";
import EventCard from "@/components/events-card";

// Move types to types/events.ts if not already there
import { Event } from "@/types/events";

type EventResponse = {
  results: Event[];
  count: number;
  next: string | null;
  previous: string | null;
};

// Make the component async
async function getEvents() {
  try {
    const response = await axios.get<EventResponse>(
      "https://1662-111-119-49-122.ngrok-free.app/api/events/events/",
      {
        // Add headers if needed
        headers: {
          Accept: "application/json",
          mode: "no-cors",
        },
      }
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events: Event[] = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
          Upcoming Events
        </h1>
        <p className="text-gray-600 mt-2">
          Join our community events and connect with like-minded professionals
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
