import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Event } from "@/types/events";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg flex flex-col justify-between overflow-hidden border hover:shadow-lg transition-shadow">
      {/* Content Section */}
      <div className="p-4">
        {/* Image Section */}
        <div className="relative w-full h-48">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Location & Date */}
        <div className="flex flex-col gap-0 mt-4">
          <div className="flex items-center gap-2 text-blue-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Biratnagar, Nepal</span>
          </div>
          <p className="text-gray-600 text-sm mt-[6px]">{event.start_date}</p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mt-[12px]">{event.title}</h3>

        {/* Description */}
        <p className="text-gray-600 mt-[12px] line-clamp-2">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Attendees & Button - Responsive Layout */}
        <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            {event.attendees.length > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 3).map((attendee, index) => (
                    <Avatar key={index} className="w-6 h-6">
                      <AvatarImage src={attendee.image} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.attendees.length > 3 && (
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>
                        +{event.attendees.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs">
                    {event.attendees.length} Peoples Enrolled
                  </span>
                </div>
              </>
            ) : (
              <span className="text-gray-600 text-sm">
                No attendees enrolled yet
              </span>
            )}
          </div>
          <Link href={"/events/event-details"}>
            <button className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Attend
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
