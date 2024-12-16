import React from "react";
import EventCard from "@/components/events-card";
import type { Event } from "@/types/events";

const DUMMY_EVENTS: Event[] = [
  {
    id: 1,
    slug: "nepali-business-networking-meetup",
    title: "Nepali Business Networking Meetup",
    thumbnail:
      "https://usercontent.one/wp/www.b2bmarketeers.nl/wp-content/uploads/2018/08/b2b-marketing-events-b2bmarketeers.jpg?media=1668764890",
    start_date: "Fri, Dec 10 2024, 6:30 PM",
    end_date: "Fri, Dec 10 2024, 9:30 PM",
    description:
      "Business Network Tech Meetup, one of the Largest Tech Event in Morang",
    tags: ["Networking", "Business", "Technology"],
    attendees: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        image: "https://github.com/shadcn.png",
        phone: "+977 9801234567",
        website: "https://example.com",
        description: "Tech Entrepreneur",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        image: "https://github.com/shadcn.png",
        phone: "+977 9801234567",
        website: "https://example.com",
        description: "Tech Entrepreneur",
      },
      {
        id: 3,
        name: "Alex Doe",
        email: "alex@example.com",
        image: "https://github.com/shadcn.png",
        phone: "+977 9801234567",
        website: "https://example.com",
        description: "Tech Entrepreneur",
      },
    ],
  },
  {
    id: 2,
    slug: "startup-pitch-night",
    title: "Startup Pitch Night",
    thumbnail:
      "https://usercontent.one/wp/www.b2bmarketeers.nl/wp-content/uploads/2018/08/b2b-marketing-events-b2bmarketeers.jpg?media=1668764890",
    start_date: "Sat, Dec 15 2024, 5:00 PM",
    end_date: "Sat, Dec 15 2024, 8:00 PM",
    description:
      "Join us for an evening of innovative startup pitches and networking opportunities",
    tags: ["Startup", "Pitch", "Investment"],
    attendees: [
      // Add attendees
    ],
  },
  {
    id: 3,
    slug: "digital-marketing-workshop",
    title: "Digital Marketing Workshop",
    thumbnail:
      "https://usercontent.one/wp/www.b2bmarketeers.nl/wp-content/uploads/2018/08/b2b-marketing-events-b2bmarketeers.jpg?media=1668764890",
    start_date: "Sun, Dec 16 2024, 2:00 PM",
    end_date: "Sun, Dec 16 2024, 5:00 PM",
    description:
      "Learn the latest digital marketing strategies from industry experts",
    tags: ["Marketing", "Digital", "Workshop"],
    attendees: [
      // Add attendees
    ],
  },
];

const EventsPage = () => {
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
        {DUMMY_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
