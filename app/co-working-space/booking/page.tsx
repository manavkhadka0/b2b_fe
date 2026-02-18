"use client";

import { useSearchParams } from "next/navigation";
import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { IncubationBookingForm } from "@/components/sections/co-working-space/incubation-booking/incubation-booking-form";

const ROOM_PARAM_MAP: Record<string, string> = {
  "big-brain": "The Big Brain Room",
  "grind-garage": "The Grind Garage",
  "fusion-lab": "The Fusion Lab",
};

export default function IncubationBookingPage() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");
  const preselectedRoom =
    roomParam && ROOM_PARAM_MAP[roomParam]
      ? ROOM_PARAM_MAP[roomParam]
      : roomParam || null;

  return (
    <ResponsiveContainer className="py-10 space-y-8">
      <HeaderSubtitle
        title="Book Now – Biratnagar Incubation Center (BIC)"
        subtitle="Submit a booking request for co-working space or meeting room at BIC. Fill in the details below."
        className="mb-8"
      />
      <IncubationBookingForm preselectedRoom={preselectedRoom} />
    </ResponsiveContainer>
  );
}
