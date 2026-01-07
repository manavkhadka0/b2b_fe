import Image from "next/image";
import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";
import { ResponsiveContainer } from "../../common/responsive-container";

interface EventsListViewProps {
  eventsResponse: EventResponse;
}

export const EventsListView = ({ eventsResponse }: EventsListViewProps) => {
  return (
    <>
      {/* Banner Section */}
      <ResponsiveContainer className="py-6 md:py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden  transition-shadow duration-300">
            <img
              src="/banner/Artboard43x-100.jpg"
              alt="Event Banner 1"
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden  transition-shadow duration-300">
            <img
              src="/banner/Artboard23x-100.jpg"
              alt="Event Banner 2"
              className="object-cover"
            />
          </div>
        </div>
      </ResponsiveContainer>

      <EventGridSection eventsResponse={eventsResponse} />
    </>
  );
};
