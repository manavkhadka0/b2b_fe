"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getIncubationCenterBookings,
  deleteIncubationCenterBooking,
  updateIncubationCenterBooking,
} from "@/services/incubationCenterBooking";
import type { IncubationCenterBooking } from "@/services/incubationCenterBooking";
import { RescheduleDialog } from "@/components/admin/RescheduleDialog";
import { BookingStatusUpdateDialog } from "@/components/admin/BookingStatusUpdateDialog";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TrashIcon } from "lucide-react";

export default function AdminCoWorkingSpacePage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<IncubationCenterBooking[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<IncubationCenterBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdateBooking, setStatusUpdateBooking] =
    useState<IncubationCenterBooking | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [rescheduleDialogBooking, setRescheduleDialogBooking] =
    useState<IncubationCenterBooking | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getIncubationCenterBookings(page);
      setBookings(data.results ?? []);
      setCount(data.count ?? 0);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
        setPageSize(data.results!.length);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
      setCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, page]);

  const handleStatusUpdate = async (is_approved: boolean) => {
    if (!statusUpdateBooking) return;
    setStatusUpdateLoading(true);
    setRowError(null);
    try {
      const updated = await updateIncubationCenterBooking(
        statusUpdateBooking.id,
        {
          is_approved,
        },
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.id === statusUpdateBooking.id ? { ...b, ...updated } : b,
        ),
      );
      setStatusUpdateBooking(null);
    } catch (err: unknown) {
      const errObj = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setRowError(
        errObj?.response?.data?.detail ||
          errObj?.message ||
          "Failed to update status.",
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setRowError(null);
    try {
      await deleteIncubationCenterBooking(deleteTarget.id);
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setCount((c) => Math.max(0, c - 1));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errObj = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setRowError(
        errObj?.response?.data?.detail ||
          errObj?.message ||
          "Failed to delete booking. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (t: string | null) => {
    if (!t) return "—";
    const parts = t.split(":");
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
    return t;
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Co-Working Space Bookings
        </h2>
        <p className="text-sm text-slate-500">
          View, approve/reject, and delete incubation center booking requests.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {rowError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {rowError}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[840px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Applicant
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company / Idea
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {booking.full_name}
                      </div>
                      <div className="text-slate-500">{booking.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div
                      className="max-w-[160px] truncate"
                      title={booking.name}
                    >
                      {booking.name || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{booking.booking_type}</div>
                    {booking.booking_type === "Co-working Seat" &&
                      booking.no_of_seats != null && (
                        <div className="text-xs text-slate-500">
                          {booking.no_of_seats} seat
                          {booking.no_of_seats !== 1 ? "s" : ""}
                        </div>
                      )}
                    {booking.booking_type === "Private Room" && (
                      <>
                        {booking.room_category && (
                          <div className="text-xs text-slate-500">
                            {booking.room_category}
                          </div>
                        )}
                        {booking.no_of_participants != null && (
                          <div className="text-xs text-slate-500">
                            {booking.no_of_participants} participant
                            {booking.no_of_participants !== 1 ? "s" : ""}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>
                      {booking.booking_date
                        ? format(new Date(booking.booking_date), "MMM d, yyyy")
                        : "—"}
                    </div>
                    <div className="text-xs">
                      {formatTime(booking.start_time)} –{" "}
                      {formatTime(booking.end_time)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex flex-wrap items-center justify-end gap-2">
                      {booking.has_pending_reschedule_request && (
                        <button
                          onClick={() => setRescheduleDialogBooking(booking)}
                          className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
                        >
                          Reschedule
                        </button>
                      )}
                      {!booking.is_approved && (
                        <button
                          onClick={() => setStatusUpdateBooking(booking)}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Update status
                        </button>
                      )}
                      <button
                        onClick={() =>
                          router.push(`/admin/co-working-space/${booking.id}`)
                        }
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteTarget(booking)}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableWrapper>

      {bookings.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={bookings.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="bookings"
          isLoading={isLoading}
        />
      )}

      <RescheduleDialog
        open={!!rescheduleDialogBooking}
        onOpenChange={(open) => !open && setRescheduleDialogBooking(null)}
        booking={rescheduleDialogBooking}
        onSuccess={fetchBookings}
      />

      <BookingStatusUpdateDialog
        booking={statusUpdateBooking}
        isOpen={!!statusUpdateBooking}
        isLoading={statusUpdateLoading}
        onClose={() => setStatusUpdateBooking(null)}
        onStatusUpdate={handleStatusUpdate}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the booking for{" "}
              <span className="font-medium">{deleteTarget?.full_name}</span> (
              {deleteTarget?.booking_date})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
