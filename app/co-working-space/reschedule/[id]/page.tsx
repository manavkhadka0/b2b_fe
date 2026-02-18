"use client";

import { useParams } from "next/navigation";
import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { RescheduleForm } from "@/components/sections/co-working-space/reschedule/reschedule-form";

export default function ReschedulePage() {
  const params = useParams();
  const id = params?.id;
  const bookingId = id ? parseInt(String(id), 10) : NaN;

  if (!id || isNaN(bookingId)) {
    return (
      <ResponsiveContainer className="py-10">
        <div className="text-center text-red-600">
          Invalid booking ID. Please use a valid reschedule link.
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer className="py-10 space-y-8">
      <HeaderSubtitle
        title="Reschedule Booking"
        subtitle="Request a new date and time for your BIC booking. Fill in the details below."
        className="mb-8"
      />
      <RescheduleForm bookingId={bookingId} />
    </ResponsiveContainer>
  );
}
