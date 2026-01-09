"use client";
import { useWishes, useOffers } from "@/app/utils/wishOffer";

const AttendeesList = () => {
  const { wishes } = useWishes();
  const { offers } = useOffers();

  const totalCount = (wishes?.length || 0) + (offers?.length || 0);

  return (
    <span className="text-xs md:text-sm font-medium text-gray-900">
      {totalCount > 0 ? `${totalCount} Wishes & Offers` : ""}
    </span>
  );
};

export default AttendeesList;
