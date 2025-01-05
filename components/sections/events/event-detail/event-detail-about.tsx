import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";

const EventDetailAbout = ({ event }: { event: Event }) => {
  return (
    <div className="">
      <HeaderSubtitle title="About the Event" subtitle={event?.description} />
    </div>
  );
};

export default EventDetailAbout;
