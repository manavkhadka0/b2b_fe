import {
  fetchExperienceZoneBookings,
  type ExperienceZoneBooking,
} from "@/services/experienceZoneBooking";
import { CimZoneBookingsGrid } from "./cim-zone-bookings-grid";

async function getConfirmedBookings(): Promise<ExperienceZoneBooking[]> {
  try {
    const now = new Date();
    const data = await fetchExperienceZoneBookings({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    return (data.results || []).filter(
      (booking) => booking.status === "Confirmed",
    );
  } catch (error) {
    console.error("Failed to fetch experience zone bookings", error);
    return [];
  }
}

export async function CimZoneBookingsList() {
  const bookings = await getConfirmedBookings();

  if (!bookings.length) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-100 pt-6 space-y-3">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Confirmed display slots
          </h3>
          <p className="text-xs text-gray-500">
            Bookings for{" "}
            {new Date().toLocaleString("en-GB", {
              month: "long",
              year: "numeric",
            })}{" "}
            at the CIM Industry Experience Zone.
          </p>
        </div>

        <span className="inline-flex items-center self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
          {bookings.length} active{" "}
          {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      <CimZoneBookingsGrid bookings={bookings} />
    </section>
  );
}
