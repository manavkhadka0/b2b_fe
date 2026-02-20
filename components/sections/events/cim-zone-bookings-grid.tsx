"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Phone,
  User2,
  Building2,
  Package,
  Briefcase,
} from "lucide-react";
import {
  fetchBookingById,
  formatPreferredMonthForOccupancy,
  type ExperienceZoneBooking,
} from "@/services/experienceZoneBooking";
import { BookingDetailDialog } from "./booking-detail-dialog";

type CimZoneBookingsGridProps = {
  bookings: ExperienceZoneBooking[];
};

export function CimZoneBookingsGrid({ bookings }: CimZoneBookingsGridProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailBooking, setDetailBooking] = useState<ExperienceZoneBooking | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async (id: number) => {
    setSelectedId(id);
    setIsLoading(true);
    setDetailBooking(null);
    try {
      const booking = await fetchBookingById(id);
      setDetailBooking(booking);
    } catch (error) {
      console.error("Failed to fetch booking details", error);
      toast.error("Failed to load booking details");
      setSelectedId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setDetailBooking(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <article
            key={booking.id}
            onClick={() => handleCardClick(booking.id)}
            className="flex flex-col rounded-xl border border-slate-100 bg-white overflow-hidden hover:border-slate-200 hover:shadow-sm transition-colors h-full cursor-pointer"
          >
            <div className="w-full aspect-[16/9] flex-shrink-0 overflow-hidden bg-slate-50 relative">
              {booking.logo ? (
                <Image
                  src={booking.logo}
                  alt={`${booking.company_name} logo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <Building2 className="w-12 h-12 text-slate-300" />
                </div>
              )}
              <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100/95 text-slate-600 shadow-sm backdrop-blur-sm flex items-center gap-1">
                  {booking.type === "Product" ? (
                    <Package className="w-3 h-3" />
                  ) : (
                    <Briefcase className="w-3 h-3" />
                  )}
                  {booking.type}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {booking.company_name}
              </h4>
              {booking.title && (
                <p className="text-xs text-slate-500">{booking.title}</p>
              )}

              {booking.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {booking.description}
                </p>
              )}

              <dl className="grid grid-cols-1 gap-x-3 gap-y-1 text-[11px] text-slate-500 sm:grid-cols-2">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  <span>
                    {formatPreferredMonthForOccupancy(booking.preferred_month)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate" title={booking.address}>
                    {booking.address}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{booking.contact_person}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{booking.phone}</span>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      {isLoading && selectedId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-busy="true"
        >
          <div className="bg-white rounded-xl px-6 py-4 shadow-xl border border-slate-200 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-700">
              Loading details...
            </span>
          </div>
        </div>
      )}

      {detailBooking && !isLoading && (
        <BookingDetailDialog booking={detailBooking} onClose={handleClose} />
      )}
    </>
  );
}
