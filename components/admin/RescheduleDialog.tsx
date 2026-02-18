"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRescheduleRequests, updateRescheduleRequest } from "@/services/rescheduleRequest";
import type { RescheduleRequest } from "@/services/rescheduleRequest";
import type { IncubationCenterBooking } from "@/services/incubationCenterBooking";
import { getIncubationCenterBookingById } from "@/services/incubationCenterBooking";
import { format } from "date-fns";

function formatTime(t: string | null) {
  if (!t) return "—";
  const parts = t.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return t;
}

function DiffRow({
  label,
  current,
  proposed,
}: {
  label: string;
  current: string;
  proposed: string;
}) {
  const changed = current !== proposed;
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2 pr-4 text-xs font-medium uppercase text-slate-500">
        {label}
      </td>
      <td className="py-2 pr-4 text-sm text-slate-600">{current || "—"}</td>
      <td className="py-2 text-sm">
        <span
          className={
            changed
              ? "font-medium text-amber-700"
              : "text-slate-600"
          }
        >
          {proposed || "—"}
        </span>
      </td>
    </tr>
  );
}

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: IncubationCenterBooking | null;
  onSuccess?: () => void;
}

export function RescheduleDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: RescheduleDialogProps) {
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !booking) return;
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRescheduleRequests(booking.id);
        setRequests(
          data.filter((r) => r.status === "Pending")
        );
      } catch {
        setError("Failed to load reschedule requests.");
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [open, booking?.id]);

  const handleAction = async (
    req: RescheduleRequest,
    status: "Approved" | "Rejected"
  ) => {
    setActionId(req.id);
    setError(null);
    try {
      await updateRescheduleRequest(req.id, { status });
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      onSuccess?.();
    } catch {
      setError("Failed to update reschedule request.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule request</DialogTitle>
          <DialogDescription>
            {booking?.full_name} — Booking #{booking?.id}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Loading reschedule requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No pending reschedule requests.
          </p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-amber-200 bg-amber-50/30 p-4"
              >
                <h4 className="mb-3 text-sm font-semibold text-slate-800">
                  Request #{req.id}
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">
                          Field
                        </th>
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">
                          Current
                        </th>
                        <th className="pb-2 text-left text-xs font-medium text-slate-500">
                          Proposed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking && (
                        <>
                          <DiffRow
                            label="Date"
                            current={
                              booking.booking_date
                                ? format(
                                    new Date(booking.booking_date),
                                    "MMM d, yyyy"
                                  )
                                : "—"
                            }
                            proposed={
                              req.new_booking_date
                                ? format(
                                    new Date(req.new_booking_date),
                                    "MMM d, yyyy"
                                  )
                                : "—"
                            }
                          />
                          <DiffRow
                            label="Time"
                            current={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
                            proposed={`${formatTime(req.new_start_time)} – ${formatTime(req.new_end_time)}`}
                          />
                          <DiffRow
                            label="Room"
                            current={booking.room_category ?? "—"}
                            proposed={req.new_room_category ?? "—"}
                          />
                          <DiffRow
                            label="Type"
                            current={booking.booking_type}
                            proposed={req.new_booking_type ?? booking.booking_type}
                          />
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {req.reason && (
                  <div className="mt-3 border-t border-amber-200 pt-3">
                    <p className="text-xs font-medium text-slate-500">
                      Reason
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{req.reason}</p>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAction(req, "Approved")}
                    disabled={actionId === req.id}
                    className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
                  >
                    {actionId === req.id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(req, "Rejected")}
                    disabled={actionId === req.id}
                    className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                  >
                    {actionId === req.id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
