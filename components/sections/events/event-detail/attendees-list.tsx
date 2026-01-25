"use client";
import { useEventWishes, useEventOffers } from "@/app/utils/wishOffer";

interface AttendeesListProps {
  eventSlug: string;
}

const AttendeesList = ({ eventSlug }: AttendeesListProps) => {
  const { wishes } = useEventWishes(eventSlug);
  const { offers } = useEventOffers(eventSlug);

  const totalCount = (wishes?.length || 0) + (offers?.length || 0);

  return (
    <span className="text-xs md:text-sm font-medium text-gray-900">
      {totalCount > 0 ? `${totalCount} Wishes & Offers` : ""}
    </span>
  );
};

export default AttendeesList;
