"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { addEventImages, deleteEvent, getEventBySlug, getEvents } from "@/services/events";
import type { Event, EventImage } from "@/types/events";
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

export default function AdminEventsPage() {
  const { isAuthenticated, isChecking, logout } = useAdminAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowError, setRowError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAddImagesOpen, setIsAddImagesOpen] = useState(false);
  const [imagesTarget, setImagesTarget] = useState<Event | null>(null);
  const [imagesPreview, setImagesPreview] = useState<EventImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents("1");
      setEvents(data.results);
      setIsLoading(false);
    };

    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setRowError(null);
    try {
      await deleteEvent(deleteTarget.slug);
      setEvents((prev) => prev.filter((e) => e.slug !== deleteTarget.slug));
      setDeleteTarget(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete event. Please try again.";
      setRowError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddImagesDialog = async (event: Event) => {
    setImagesTarget(event);
    setImagesPreview(event.images ?? []);
    setSelectedImages([]);
    setUploadError(null);
    setIsAddImagesOpen(true);
    try {
      const full = await getEventBySlug(event.slug);
      if (full?.images) {
        setImagesPreview(full.images);
        setEvents((prev) =>
          prev.map((e) => (e.slug === full.slug ? { ...e, images: full.images } : e))
        );
      }
    } catch {
      // ignore preview fetch errors
    }
  };

  const handleUploadImages = async () => {
    if (!imagesTarget) return;
    if (selectedImages.length === 0) {
      setUploadError("Please select at least one image.");
      return;
    }

    setIsUploadingImages(true);
    setUploadError(null);
    setRowError(null);
    try {
      await addEventImages(imagesTarget.id, selectedImages);
      const refreshed = await getEventBySlug(imagesTarget.slug);
      if (refreshed?.images) {
        setImagesPreview(refreshed.images);
        setEvents((prev) =>
          prev.map((e) =>
            e.slug === refreshed.slug ? { ...e, images: refreshed.images } : e
          )
        );
      }
      setIsAddImagesOpen(false);
      setImagesTarget(null);
      setSelectedImages([]);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to upload images. Please try again.";
      setUploadError(message);
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Events Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/events/create")}
            className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            Create event
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      {rowError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {rowError}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Start date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
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
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.slug}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {event.start_date || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {event.status || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {event.location || "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Placeholder for edit route
                          router.push(`/admin/events/${event.slug}/edit`);
                        }}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openAddImagesDialog(event)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Add images
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(event);
                        }}
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
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteTarget?.title}</span>? This
              action cannot be undone.
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

      <Dialog
        open={isAddImagesOpen}
        onOpenChange={(open) => {
          setIsAddImagesOpen(open);
          if (!open) {
            setImagesTarget(null);
            setImagesPreview([]);
            setSelectedImages([]);
            setUploadError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add images</DialogTitle>
            <DialogDescription>
              Upload one or more images for{" "}
              <span className="font-medium">{imagesTarget?.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {imagesPreview.length > 0 && (
              <div>
                <Label className="mb-2 block text-sm font-medium text-slate-700">
                  Current images
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {imagesPreview.map((img) => (
                    <div
                      key={img.id}
                      className="overflow-hidden rounded-md border bg-slate-50"
                    >
                      <img
                        src={img.image}
                        alt="Event image"
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="event-images">Add new images</Label>
              <Input
                id="event-images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setSelectedImages(files);
                  setUploadError(null);
                }}
              />
              <p className="text-xs text-slate-500">
                Selected: {selectedImages.length || 0}
              </p>
              {uploadError && (
                <p className="text-sm text-rose-600">{uploadError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddImagesOpen(false)}
              disabled={isUploadingImages}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUploadImages}
              disabled={isUploadingImages || !imagesTarget}
            >
              {isUploadingImages ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
