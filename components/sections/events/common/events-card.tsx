import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Event } from "@/types/events";
import { Avatar, AvatarFallback } from "../../../ui/avatar";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg flex flex-col justify-between overflow-hidden border hover:shadow-lg transition-shadow">
      <Link href={`/events/${event.slug}`}>
        {/* Content Section */}
        {/* Image Section */}
        <div className="relative w-full h-48">
          <img
            src={event.thumbnail || "/placeholder-image.jpg"} // Fallback to placeholder if thumbnail is missing
            alt={event.title}
            className="object-cover rounded-lg w-full h-full"
          />
        </div>

        {/* Location & Date */}
        <div className="flex flex-col  mt-2">
          {/* Location */}
          <div className="flex items-center  text-blue-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              <p className="text-sm">
                {" "}
                {event.location
                  ? event.location.split(" ").slice(0, 3).join(" ")
                  : "Unknown Location"}
              </p>
            </span>
          </div>
          {/* Date */}
          <p className="text-gray-600 text-sm ">{event.start_date}</p>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mt-3">{event.title}</h3>

        {/* Description */}
        <p className="text-gray-600  text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap  mt-4 gap-1">
          {event.tags.length > 0 ? (
            event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No tags available</span>
          )}
        </div>

        {/* Attendees & Button */}
        <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-1 sm:items-center justify-between">
          <div className="flex flex-row gap-1 items-center">
            {event.attendees_count > 0 ? (
              <>
                <div className="flex -space-x-1">
                  {event.attendees_count > 3 && (
                    <Avatar className="w-5 h-5">
                      <AvatarFallback>
                        +{event.attendees_count - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <span className="text-gray-600 text-xs">
                  {event.attendees_count} People Enrolled
                </span>
              </>
            ) : (
              <span className="text-gray-600 text-sm">
                No attendees enrolled yet
              </span>
            )}
          </div>

          <button className="w-full sm:w-auto bg-blue-600 text-white py-1 px-4 text-sm rounded-lg hover:bg-blue-700 transition-colors">
            Attend
          </button>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
