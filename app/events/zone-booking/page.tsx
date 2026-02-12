"use client";

import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { ExperienceZoneBookingForm } from "@/components/sections/experience-zone-booking/experience-zone-booking-form";

export default function ZoneBookingPage() {
  return (
    <ResponsiveContainer className="py-10 space-y-8">
      <HeaderSubtitle
        title="Book CIM Industry Experience Zone"
        subtitle="Submit a booking request to display your products or services at the CIM Industry Experience Zone. Fill in the details below."
        className="mb-8"
      />
      <ExperienceZoneBookingForm />
    </ResponsiveContainer>
  );
}
