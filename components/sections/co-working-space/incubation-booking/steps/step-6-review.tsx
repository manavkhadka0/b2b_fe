"use client";

import { UseFormReturn } from "react-hook-form";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import { format } from "date-fns";

interface Step6ReviewProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep6Review({ form }: Step6ReviewProps) {
  const values = form.getValues();

  const selectedServices = [
    values.wifi && "High-speed Internet / Wi-Fi",
    values.photocopy && "Photocopy",
    values.printing && "Printing",
    values.interactive_board && "Interactive Board (Big Brain Room)",
    values.whiteboard_marker && "Whiteboard + Marker",
    values.tea_coffee_water && "Tea/Coffee/Water arrangement",
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Review Your Booking</h2>

      <div className="space-y-6">
        {/* Booking Details */}
        <div className="space-y-2">
          <h3 className="font-medium">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p className="font-medium">{values.booking_type}</p>
            </div>
            {values.room_category && (
              <div>
                <span className="text-sm text-gray-500">Room Category:</span>
                <p className="font-medium">{values.room_category}</p>
              </div>
            )}
            {values.booking_type === "Co-working Seat" &&
              values.no_of_seats != null && (
                <div>
                  <span className="text-sm text-gray-500">
                    No. of Seats Needed:
                  </span>
                  <p className="font-medium">{values.no_of_seats}</p>
                </div>
              )}
            {values.booking_type === "Private Room" &&
              values.no_of_participants != null && (
                <div>
                  <span className="text-sm text-gray-500">
                    No. of Participants:
                  </span>
                  <p className="font-medium">{values.no_of_participants}</p>
                </div>
              )}
            {values.booking_date && (
              <div>
                <span className="text-sm text-gray-500">Date:</span>
                <p className="font-medium">
                  {format(new Date(values.booking_date), "PPP")}
                </p>
              </div>
            )}
            {values.start_time && values.end_time && (
              <div>
                <span className="text-sm text-gray-500">Time:</span>
                <p className="font-medium">
                  {values.start_time} – {values.end_time}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Applicant Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Applicant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p className="font-medium">{values.full_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{values.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Mobile / Contact No.:
              </span>
              <p className="font-medium">{values.phone}</p>
            </div>
            <div className="col-span-full">
              <span className="text-sm text-gray-500">Address:</span>
              <p className="font-medium">{values.address}</p>
            </div>
          </div>
        </div>

        {/* Company / Idea Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Company / Idea Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">
                Company / Startup / Idea Name:
              </span>
              <p className="font-medium">{values.name}</p>
            </div>
            {values.founder_name && (
              <div>
                <span className="text-sm text-gray-500">Founder Name:</span>
                <p className="font-medium">{values.founder_name}</p>
              </div>
            )}
            {values.founder_designation && (
              <div>
                <span className="text-sm text-gray-500">
                  Founder Role / Designation:
                </span>
                <p className="font-medium">{values.founder_designation}</p>
              </div>
            )}
            <div className="col-span-full">
              <span className="text-sm text-gray-500">
                Brief Purpose / Notes:
              </span>
              <p className="font-medium">{values.purpose}</p>
            </div>
          </div>
        </div>

        {/* Specific Services Needed */}
        {selectedServices.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Specific Services Needed</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">
                {selectedServices.join(", ")}
              </p>
            </div>
          </div>
        )}

        {values.other_service && (
          <div className="space-y-2">
            <h3 className="font-medium">Other (please specify)</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{values.other_service}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
