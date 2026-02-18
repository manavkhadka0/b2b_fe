"use client";

import { UseFormReturn } from "react-hook-form";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Users, DoorOpen } from "lucide-react";

interface Step1BookingTypeProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep1BookingType({ form }: Step1BookingTypeProps) {

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">A) What do you want to book?</h2>
      <p className="text-sm text-gray-600">Select one:</p>

      <FormField
        control={form.control}
        name="booking_type"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  field.onChange("Co-working Seat");
                  form.setValue("room_category", null);
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && field.onChange("Co-working Seat")
                }
                className={cn(
                  "group relative min-h-[120px] p-4 sm:p-6 flex flex-row sm:flex-col items-start gap-4 sm:gap-3",
                  "hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer",
                  "border rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  field.value === "Co-working Seat"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                )}
              >
                <Users
                  size={36}
                  className="text-blue-600 flex-shrink-0 sm:w-12 sm:h-12 transition-transform group-hover:scale-110"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Co-working Seat (Individual / Startup)
                  </h3>
                  <p className="text-sm text-gray-500">
                    Book seat(s) in shared workspace (maximum 9 seats at a time)
                  </p>
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => field.onChange("Private Room")}
                onKeyDown={(e) =>
                  e.key === "Enter" && field.onChange("Private Room")
                }
                className={cn(
                  "group relative min-h-[120px] p-4 sm:p-6 flex flex-row sm:flex-col items-start gap-4 sm:gap-3",
                  "hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer",
                  "border rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  field.value === "Private Room"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                )}
              >
                <DoorOpen
                  size={36}
                  className="text-blue-600 flex-shrink-0 sm:w-12 sm:h-12 transition-transform group-hover:scale-110"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Private Room (Full Room Booking)
                  </h3>
                  <p className="text-sm text-gray-500">
                    Book a full room for your team/session
                  </p>
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
