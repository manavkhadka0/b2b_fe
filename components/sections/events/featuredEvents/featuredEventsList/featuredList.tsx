"use client";

import Image from "next/image";
import { EventResponse } from "@/types/events";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ViewSectionProps {
  sideEvents: EventResponse["results"];
}

const ViewSection = ({ sideEvents }: ViewSectionProps) => {
  return (
    <div className="flex flex-col gap-6">
      {sideEvents.map((event) => (
        <div key={event.id} className="relative rounded-xl overflow-hidden">
          <div className="relative w-full h-[230px] rounded-xl">
            <ImageWithFallback
              src={event.thumbnail}
              alt={event.title || "Event Image"}
              fallback={"/placeholder.jpg"}
              blurDataURL={"/blur.png"}
              placeholder="blur"
              width={400}
              height={250}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>

          {/* Event Details */}
          <div className="absolute bottom-0 left-0 w-full text-white p-3 rounded-b-xl">
            <h4 className="text-lg font-medium">
              {event.title || "Event Title"}
            </h4>
            <div className="flex gap-2 mt-1">
              {event.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs text-white px-2 py-1 border rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <p className="text-xs mt-1">
              👥 {event.attendees_count || 0} People Enrolled
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewSection;
