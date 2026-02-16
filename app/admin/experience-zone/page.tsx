"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  fetchExperienceZoneBookings,
  updateExperienceZoneBooking,
  deleteExperienceZoneBooking,
  formatPreferredMonthForOccupancy,
  type ExperienceZoneBooking,
  type ExperienceZoneBookingUpdatePayload,
} from "@/services/experienceZoneBooking";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

/** Same as zone-booking: value YYYY-MM; API expects YYYY-MM-01. Admin gets previous year too so existing bookings show. */
function getPreferredMonthOptions(): { value: string; label: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const options: { value: string; label: string }[] = [];
  MONTHS.forEach((mo) => {
    options.push({
      value: `${currentYear - 1}-${mo.value}`,
      label: `${mo.label} ${currentYear - 1}`,
    });
  });
  MONTHS.forEach((mo) => {
    if (parseInt(mo.value, 10) >= currentMonth) {
      options.push({
        value: `${currentYear}-${mo.value}`,
        label: `${mo.label} ${currentYear}`,
      });
    }
  });
  MONTHS.forEach((mo) => {
    options.push({
      value: `${currentYear + 1}-${mo.value}`,
      label: `${mo.label} ${currentYear + 1}`,
    });
  });
  return options;
}

/** Normalize API value (YYYY-MM or YYYY-MM-01) to YYYY-MM for Select. */
function preferredMonthToSelectValue(
  preferredMonth: string | undefined,
): string {
  if (!preferredMonth) return "";
  return preferredMonth.slice(0, 7);
}

/** Ensure we send YYYY-MM-01 to API (same as zone-booking form). */
function preferredMonthToPayload(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  return value.length === 7 ? `${value}-01` : value;
}

export default function AdminExperienceZonePage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<ExperienceZoneBooking[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowError, setRowError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<ExperienceZoneBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewTarget, setViewTarget] = useState<ExperienceZoneBooking | null>(
    null,
  );

  const [editTarget, setEditTarget] = useState<ExperienceZoneBooking | null>(
    null,
  );
  const [editForm, setEditForm] = useState<ExperienceZoneBookingUpdatePayload>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /** Admin filter: 1–12 for month, or "all" for no filter. */
  const [filterMonth, setFilterMonth] = useState<string>("all");

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const monthNum =
          filterMonth === "all" ? undefined : parseInt(filterMonth, 10);
        const data = await fetchExperienceZoneBookings({
          ...(monthNum != null && monthNum >= 1 && monthNum <= 12
            ? { month: monthNum }
            : {}),
          page,
        });
        setBookings(data.results ?? []);
        setCount(data.count ?? 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
        if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
          setPageSize(data.results!.length);
        }
      } catch {
        setRowError("Failed to load experience zone bookings.");
        setBookings([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated, filterMonth, page]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setRowError(null);
    try {
      await deleteExperienceZoneBooking(deleteTarget.id);
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setCount((c) => Math.max(0, c - 1));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Failed to delete booking. Please try again.";
      setRowError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = (booking: ExperienceZoneBooking) => {
    setEditTarget(booking);
    setEditForm({
      company_name: booking.company_name,
      address: booking.address,
      email: booking.email,
      phone: booking.phone,
      contact_person: booking.contact_person,
      designation: booking.designation ?? undefined,
      preferred_month: booking.preferred_month,
      description: booking.description,
      type: booking.type,
      title: booking.title || undefined,
      status: booking.status,
    });
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setIsSaving(true);
    setEditError(null);
    try {
      const payload: ExperienceZoneBookingUpdatePayload = {
        ...editForm,
        preferred_month:
          preferredMonthToPayload(editForm.preferred_month) ??
          editForm.preferred_month,
      };
      const updated = await updateExperienceZoneBooking(editTarget.id, payload);
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b)),
      );
      setEditTarget(null);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Failed to update booking. Please try again.";
      setEditError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const preferredMonthOptions = useMemo(() => getPreferredMonthOptions(), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Experience Zone Bookings
          </h2>
          <p className="text-sm text-slate-500">
            View, update, and delete display slot bookings at the CIM Industry
            Experience Zone.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="filter-month"
            className="text-sm text-slate-600 shrink-0"
          >
            Filter by month
          </Label>
          <Select
            value={filterMonth}
            onValueChange={(v) => {
              setFilterMonth(v);
              setPage(1);
            }}
          >
            <SelectTrigger id="filter-month" className="w-[180px]">
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {rowError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {rowError}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[640px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preferred month
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
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {booking.company_name}
                    </span>
                    {booking.title && (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {booking.title}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        booking.type === "Product"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {booking.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {booking.contact_person}
                    <span className="block text-xs text-slate-500">
                      {booking.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPreferredMonthForOccupancy(booking.preferred_month)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : booking.status === "Rejected"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewTarget(booking)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(booking)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(booking)}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Delete
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

      {/* View dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>
              {viewTarget?.company_name} — {viewTarget?.type}
            </DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-500">Company</dt>
                <dd className="text-slate-900">{viewTarget.company_name}</dd>
              </div>
              {viewTarget.title && (
                <div>
                  <dt className="font-medium text-slate-500">Title</dt>
                  <dd className="text-slate-900">{viewTarget.title}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-slate-500">Type</dt>
                <dd className="text-slate-900">{viewTarget.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Status</dt>
                <dd className="text-slate-900">{viewTarget.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Contact person</dt>
                <dd className="text-slate-900">{viewTarget.contact_person}</dd>
              </div>
              {viewTarget.designation && (
                <div>
                  <dt className="font-medium text-slate-500">Designation</dt>
                  <dd className="text-slate-900">{viewTarget.designation}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-slate-500">Email</dt>
                <dd className="text-slate-900">{viewTarget.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Phone</dt>
                <dd className="text-slate-900">{viewTarget.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Address</dt>
                <dd className="text-slate-900">{viewTarget.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Preferred month</dt>
                <dd className="text-slate-900">
                  {formatPreferredMonthForOccupancy(viewTarget.preferred_month)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Description</dt>
                <dd className="text-slate-900 whitespace-pre-wrap">
                  {viewTarget.description || "—"}
                </dd>
              </div>
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTarget(null)}>
              Close
            </Button>
            {viewTarget && (
              <Button onClick={() => openEdit(viewTarget)}>Edit</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit booking</DialogTitle>
            <DialogDescription>
              Update booking details. Preferred month uses the same format as
              the public booking form.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Type & details (same as zone-booking step 1) */}
            <div className="space-y-3  border-slate-100">
              <p className="text-sm font-medium text-slate-700">
                Type &amp; details
              </p>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editForm.type ?? "Product"}
                    onValueChange={(val: "Product" | "Service") =>
                      setEditForm((f) => ({ ...f, type: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">
                    Product or service name (optional)
                  </Label>
                  <Input
                    id="edit-title"
                    value={editForm.title ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        title: e.target.value || undefined,
                      }))
                    }
                    placeholder="e.g. Product display"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={3}
                    value={editForm.description ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Details about products or services"
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Company (same as zone-booking step 3) */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-700">
                Company information
              </p>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company name</Label>
                  <Input
                    id="edit-company"
                    value={editForm.company_name ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        company_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={editForm.address ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Personal (same as zone-booking step 4 — preferred_month as Select, stored YYYY-MM-01) */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-700">
                Contact &amp; preferred month
              </p>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact person</Label>
                  <Input
                    id="edit-contact"
                    value={editForm.contact_person ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        contact_person: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-designation">
                    Designation (optional)
                  </Label>
                  <Input
                    id="edit-designation"
                    value={editForm.designation ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        designation: e.target.value || null,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred month</Label>
                  <Select
                    value={preferredMonthToSelectValue(
                      editForm.preferred_month,
                    )}
                    onValueChange={(val) => {
                      const [y, m] = val.split("-");
                      setEditForm((f) => ({
                        ...f,
                        preferred_month: `${y}-${m}-01`,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred month" />
                    </SelectTrigger>
                    <SelectContent>
                      {preferredMonthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Same as booking form — stored as first day of month.
                  </p>
                </div>
              </div>
            </div>

            {editError && (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {editError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
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
              <span className="font-medium">{deleteTarget?.company_name}</span>?
              This action cannot be undone.
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
