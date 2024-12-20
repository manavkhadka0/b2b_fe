"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Tag = {
  id: number;
  name: string;
};

type Organizer = {
  id: number;
  email: string;
  username: string;
  bio: string;
  date_of_birth: string | null;
  phone_number: string;
  address: string;
  designation: string;
  alternate_no: string | null;
};

type Event = {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  start_date: string;
  end_date: string;
  location: string;
  organizer: Organizer;
  attendees_count: number;
  thumbnail: string | null;
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://1662-111-119-49-122.ngrok-free.app/api/events/events/"
        );
        console.log("API Response:", response.data);
        setEvents(response.data.results || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Axios error:", err.message);
          setError(
            err.response
              ? `HTTP error! status: ${err.response.status}`
              : err.message
          );
        } else {
          console.error("Unknown error:", err);
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

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
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex flex-col">
              {/* Thumbnail */}
              {event.thumbnail ? (
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="rounded-lg object-cover mb-4"
                />
              ) : (
                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}

              {/* Title */}
              <h2 className="text-lg font-bold">{event.title}</h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2">
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </p>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-2"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              <p className="text-sm text-gray-600 mt-2">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Start Date:</strong>{" "}
                {new Date(event.start_date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>End Date:</strong>{" "}
                {new Date(event.end_date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Attendees:</strong> {event.attendees_count}
              </p>

              {/* Organizer Info */}
              <p className="text-sm text-gray-600 mt-2">
                <strong>Organizer:</strong> {event.organizer.username} (
                {event.organizer.email})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
