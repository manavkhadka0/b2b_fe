"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getIncubationCenterBookingById,
  updateIncubationCenterBooking,
  type IncubationCenterBooking,
} from "@/services/incubationCenterBooking";
import { RescheduleDialog } from "@/components/admin/RescheduleDialog";
import { BookingStatusUpdateDialog } from "@/components/admin/BookingStatusUpdateDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

function formatTime(t: string | null) {
  if (!t) return "—";
  const parts = t.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return t;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-2">
      <dt className="w-36 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="min-w-0 text-sm text-slate-700">{value ?? "—"}</dd>
    </div>
  );
}

export default function CoWorkingSpaceDetailPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [booking, setBooking] = useState<IncubationCenterBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateBooking, setStatusUpdateBooking] =
    useState<IncubationCenterBooking | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !isAuthenticated) return;
      setIsLoading(true);
      setError(null);
      try {
        const bookingData = await getIncubationCenterBookingById(id);
        setBooking(bookingData);
      } catch {
        setError("Failed to load booking.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);

  const handleStatusUpdate = async (is_approved: boolean) => {
    if (!statusUpdateBooking) return;
    setStatusUpdateLoading(true);
    setError(null);
    try {
      const updated = await updateIncubationCenterBooking(
        statusUpdateBooking.id,
        { is_approved },
      );
      setBooking(updated);
      setStatusUpdateBooking(null);
    } catch {
      setError("Failed to update status.");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleRescheduleSuccess = async () => {
    if (booking) {
      const refreshed = await getIncubationCenterBookingById(booking.id);
      setBooking(refreshed);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-w-0 space-y-4">
        <Link
          href="/admin/co-working-space"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to bookings
        </Link>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || "Booking not found."}
        </div>
      </div>
    );
  }

  const services = (
    [
      booking.wifi && "Wi-Fi",
      booking.photocopy && "Photocopy",
      booking.printing && "Printing",
      booking.interactive_board && "Interactive Board",
      booking.whiteboard_marker && "Whiteboard + Marker",
      booking.tea_coffee_water && "Tea/Coffee/Water",
    ] as (string | false)[]
  ).filter((s): s is string => Boolean(s));

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/co-working-space"
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to bookings
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900">
              Booking by {booking.full_name} for {booking.name}
            </h1>
            <Badge
              variant="secondary"
              className={
                booking.is_approved
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }
            >
              {booking.is_approved ? "Approved" : "Pending"}
            </Badge>
            {booking.has_pending_reschedule_request && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                Reschedule pending
              </Badge>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {booking.has_pending_reschedule_request && (
              <button
                onClick={() => setRescheduleDialogOpen(true)}
                className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
              >
                Reschedule
              </button>
            )}
            {!booking.is_approved && (
              <button
                onClick={() => setStatusUpdateBooking(booking)}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Update status
              </button>
            )}
          </div>
        </div>
      </div>

      <RescheduleDialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        booking={booking}
        onSuccess={handleRescheduleSuccess}
      />

      <BookingStatusUpdateDialog
        booking={statusUpdateBooking}
        isOpen={!!statusUpdateBooking}
        isLoading={statusUpdateLoading}
        onClose={() => setStatusUpdateBooking(null)}
        onStatusUpdate={handleStatusUpdate}
      />

      <div className="grid gap-6 pt-4 md:grid-cols-2">
        <div className="border-b border-slate-200 pb-6 md:border-b-0 md:border-r md:pr-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Applicant
          </h3>
          <dl className="space-y-0">
            <DetailRow label="Name" value={booking.full_name} />
            <DetailRow label="Email" value={booking.email} />
            <DetailRow label="Phone" value={booking.phone} />
            <DetailRow label="Address" value={booking.address} />
          </dl>
        </div>

        <div className="">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Company / Idea
          </h3>
          <dl className="space-y-0">
            <DetailRow label="Name" value={booking.name} />
            <DetailRow label="Founder" value={booking.founder_name} />
            <DetailRow
              label="Designation"
              value={booking.founder_designation}
            />
            <DetailRow label="Purpose" value={booking.purpose} />
          </dl>
        </div>

        <div className="pt-6 md:border-t-0 md:border-r md:pr-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Booking
          </h3>
          <dl className="space-y-0">
            <DetailRow label="Type" value={booking.booking_type} />
            <DetailRow
              label="Date"
              value={
                booking.booking_date
                  ? format(new Date(booking.booking_date), "MMM d, yyyy")
                  : "—"
              }
            />
            <DetailRow
              label="Time"
              value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
            />
            {booking.room_category && (
              <DetailRow label="Room" value={booking.room_category} />
            )}
            {booking.no_of_seats != null && (
              <DetailRow label="Seats" value={String(booking.no_of_seats)} />
            )}
            {booking.no_of_participants != null && (
              <DetailRow
                label="Participants"
                value={String(booking.no_of_participants)}
              />
            )}
          </dl>
        </div>

        <div className=" pt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Services
          </h3>
          <dl className="space-y-0">
            <DetailRow
              label="Selected"
              value={
                services.length > 0 ? (
                  <span className="inline-flex flex-wrap gap-1">
                    {services.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 text-xs"
                      >
                        {s}
                      </Badge>
                    ))}
                  </span>
                ) : (
                  "None"
                )
              }
            />
            {booking.other_service && (
              <DetailRow label="Other" value={booking.other_service} />
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
