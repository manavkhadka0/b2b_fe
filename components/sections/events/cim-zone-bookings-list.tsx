import { CalendarDays, MapPin, Phone, User2, Building2 } from "lucide-react";
import {
  fetchExperienceZoneBookings,
  formatPreferredMonthForOccupancy,
  type ExperienceZoneBooking,
} from "@/services/experienceZoneBooking";

async function getConfirmedBookings(): Promise<ExperienceZoneBooking[]> {
  try {
    const data = await fetchExperienceZoneBookings();
    return (data.results || []).filter(
      (booking) => booking.status === "Confirmed",
    );
  } catch (error) {
    console.error("Failed to fetch experience zone bookings", error);
    return [];
  }
}

function formatCreatedAt(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
            Recent bookings at the CIM Industry Experience Zone.
          </p>
        </div>

        <span className="inline-flex items-center self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
          {bookings.length} active{" "}
          {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <article
            key={booking.id}
            className="flex flex-col gap-2.5 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm  sm:p-4"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div>
                <h4 className="text-[13px] font-semibold text-gray-900">
                  {booking.company_name}
                </h4>
                {booking.title && (
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {booking.title}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                {booking.type}
              </span>
            </div>

            {booking.description && (
              <p className="text-xs leading-snug text-gray-600 line-clamp-2">
                {booking.description}
              </p>
            )}

            <dl className="grid grid-cols-1 gap-x-3 gap-y-1 text-[11px] text-gray-500 sm:grid-cols-2">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                <span>
                  {formatPreferredMonthForOccupancy(booking.preferred_month)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate" title={booking.address}>
                  {booking.address}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <User2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate">{booking.contact_person}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{booking.phone}</span>
              </div>
            </dl>

            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-400">
              <div className="inline-flex items-center gap-1.5">
                <Building2 className="h-3 w-3" />
                <span>Confirmed booking</span>
              </div>

              {booking.created_at && (
                <span>Created {formatCreatedAt(booking.created_at)}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
