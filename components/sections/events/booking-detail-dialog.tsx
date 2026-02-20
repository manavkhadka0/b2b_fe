"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Package,
  Briefcase,
  Building2,
} from "lucide-react";
import type { ExperienceZoneBooking } from "@/services/experienceZoneBooking";
import { formatPreferredMonthForOccupancy } from "@/services/experienceZoneBooking";

export type BookingDetailDialogProps = {
  booking: ExperienceZoneBooking;
  onClose: () => void;
};

export function BookingDetailDialog({
  booking,
  onClose,
}: BookingDetailDialogProps) {
  const created = new Date(booking.created_at);
  const createdStr = created.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasPhone = Boolean(booking.phone);
  const hasEmail = Boolean(booking.email);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-detail-title"
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[16/9] bg-slate-100 shrink-0">
          {booking.logo ? (
            <Image
              src={booking.logo}
              alt={`${booking.company_name} logo`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <Building2 className="w-16 h-16 text-slate-300" />
            </div>
          )}
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-white/95 text-slate-700 shadow-sm flex items-center gap-1.5">
            {booking.type === "Product" ? (
              <Package className="w-3.5 h-3.5" />
            ) : (
              <Briefcase className="w-3.5 h-3.5" />
            )}
            {booking.type}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/95 text-slate-600 hover:bg-white hover:text-slate-800 shadow-sm transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-4 sm:p-5 space-y-5">
            <div>
              <h2
                id="booking-detail-title"
                className="text-lg font-bold text-slate-900 leading-snug"
              >
                {booking.company_name}
              </h2>
              {booking.title && (
                <p className="text-sm text-slate-500 mt-0.5">{booking.title}</p>
              )}
            </div>

            {booking.description && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {booking.description}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Contact Person
                </h3>
                <p className="text-sm text-slate-800 font-medium">
                  {booking.contact_person}
                </p>
                {booking.designation && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {booking.designation}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Preferred Month
                </h3>
                <p className="text-sm text-slate-700">
                  {formatPreferredMonthForOccupancy(booking.preferred_month)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Address
              </h3>
              <p className="text-sm text-slate-700">{booking.address}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Booked on
              </h3>
              <p className="text-sm text-slate-700">{createdStr}</p>
            </div>

            {(hasPhone || hasEmail) && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Contact
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {hasPhone && (
                    <li className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${booking.phone}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {booking.phone}
                      </a>
                    </li>
                  )}
                  {hasEmail && (
                    <li className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${booking.email}`}
                        className="hover:text-blue-600 transition-colors break-all"
                      >
                        {booking.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
