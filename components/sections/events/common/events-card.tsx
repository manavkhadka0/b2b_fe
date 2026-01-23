import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Event } from "@/types/events";
import { Avatar, AvatarFallback } from "../../../ui/avatar";
import Link from "next/link";

import { formatNepaliDate, formatToNepaliMonthDayYear } from "@/lib/nepali-date";

interface EventCardProps {
  event: Event;
  hideAttendButton?: boolean;
}

const EventCard = ({ event, hideAttendButton = false }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 transition hover:scale-[1.01] duration-400">
      <Link href={`/events/${event.slug}`} className="flex flex-col h-full">
        {/* Image Section - full width */}
        <div className="relative w-full h-48">
          <img
            src={event.thumbnail || "/placeholder-image.jpg"} // Fallback to placeholder if thumbnail is missing
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4 flex flex-col justify-between">
          <h3 className="text-xl font-bold mt-3 mb-2">{event.title}</h3>

          {/* Location & Date */}
          <div className="flex flex-col space-y-2">
            {/* Location */}
            <div className="flex items-start text-blue-700">
              <span className="text-sm">
                <p className="text-sm">{event.location}</p>
              </span>
            </div>
            {/* Date */}
            <p className="text-gray-600 text-sm font-bold">
              {formatToNepaliMonthDayYear(event.start_date || "")}
            </p>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap mt-4 gap-1">
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
              <></>
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
                <></>
              )}
            </div>

            {!hideAttendButton && (
              <Link href={`/events/${event.slug}`} className="w-full">
                <button className="w-full bg-blue-600 text-white py-3 px-4 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Attend This Event
                </button>
              </Link>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
