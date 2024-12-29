"use client";

import Image from "next/image";
import { EventResponse } from "@/types/events";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface HeroSectionProps {
  mainEvent: EventResponse["results"][0];
  hasSideEvents: boolean;
}

const HeroSection = ({ mainEvent, hasSideEvents }: HeroSectionProps) => {
  return (
    <div
      className={`relative ${
        hasSideEvents ? "col-span-2 lg:row-span-2" : "col-span-3"
      }`}
    >
      <div
        className={`relative w-full ${
          hasSideEvents ? "h-[400px] lg:h-[500px]" : "h-[600px]"
        } rounded-xl overflow-hidden`}
      >
        <ImageWithFallback
          src={mainEvent.thumbnail || "/placeholder.jpg"}
          alt={mainEvent.title || "Event Image"}
          width={800}
          placeholder="blur"
          blurDataURL={"/blur.png"}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Event Details */}
      <div className="absolute bottom-8 left-0 w-full text-white p-4 rounded-b-xl">
        <p className="text-sm">📍 {mainEvent.location || "Unknown Location"}</p>
        <h3 className="text-xl font-semibold mt-1">
          {mainEvent.title || "Event Title"}
        </h3>
        <p className="text-sm mt-1">
          {mainEvent.description || "Event Description"}
        </p>
        <div className="flex gap-2 mt-2">
          {mainEvent.tags?.map((tag) => (
            <span
              key={tag.id}
              className="text-xs text-white px-2 border py-1 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <p className="text-xs mt-2">
          👥 {mainEvent.attendees_count || 0} People Enrolled
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
