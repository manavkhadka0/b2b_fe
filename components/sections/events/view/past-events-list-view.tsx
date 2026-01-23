import { EventGridSection } from "../events-list/event-grid-section";
import type { EventResponse } from "@/types/events";
import { ResponsiveContainer } from "../../common/responsive-container";

interface PastEventsListViewProps {
    eventsResponse: EventResponse;
}

export const PastEventsListView = ({
    eventsResponse,
}: PastEventsListViewProps) => {
    return (
        <>
            <ResponsiveContainer className="py-6 md:py-8 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="relative w-auto h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden  transition-shadow duration-300">
                        <img
                            src="/banner/Artboard43x-100.jpg"
                            alt="Event Banner 1"
                            className="object-cover"
                        />
                    </div>
                    <div className="relative w-auto h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden  transition-shadow duration-300">
                        <img
                            src="/banner/Artboard23x-100.jpg"
                            alt="Event Banner 2"
                            className="object-cover"
                        />
                    </div>
                </div>
            </ResponsiveContainer>

            <EventGridSection
                eventsResponse={eventsResponse}
                title="Completed B2B Networking Events"
                subtitle="Explore our successful past events"
                hideAttendButton={true}
            />
        </>
    );
};
