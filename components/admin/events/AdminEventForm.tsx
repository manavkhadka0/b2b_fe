"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types/events";
import { createEvent, updateEvent } from "@/services/events";

type AdminEventFormMode = "create" | "edit";

interface AdminEventFormProps {
  mode: AdminEventFormMode;
  initialData?: Partial<Event> | null;
  slug?: string;
}

const formatDateTimeForInput = (value?: string | null) => {
  if (!value) return "";
  // Only try to transform if the string looks like an ISO datetime
  // (this avoids trying to parse already formatted display strings like "Poush 12, 2035 03:33 PM")
  const isIsoLike = /^\d{4}-\d{2}-\d{2}T?\d{0,2}:?\d{0,2}/.test(value);
  if (!isIsoLike) return "";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export default function AdminEventForm({
  mode,
  initialData,
  slug,
}: AdminEventFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft" | "Cancelled">(
    "Draft"
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title ?? "");
    setDescription(initialData.description ?? "");
    setStartDate(formatDateTimeForInput(initialData.start_date));
    setEndDate(formatDateTimeForInput(initialData.end_date));
    setLocation(initialData.location ?? "");
    setContactPerson(initialData.contact_person ?? "");
    setContactNumber(initialData.contact_number ?? "");
    setStatus(
      (initialData.status as "Published" | "Draft" | "Cancelled") ?? "Draft"
    );
    setIsFeatured(initialData.is_featured ?? false);
    setIsPopular(initialData.is_popular ?? false);
  }, [initialData]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    setDescription(editorRef.current.innerHTML);
  };

  const applyFormatting = (command: string) => {
    if (typeof document === "undefined") return;
    document.execCommand(command, false);
    handleEditorInput();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (startDate)
        formData.append("start_date", new Date(startDate).toISOString());
      if (endDate) formData.append("end_date", new Date(endDate).toISOString());
      formData.append("location", location);
      formData.append("contact_person", contactPerson);
      formData.append("contact_number", contactNumber);
      formData.append("status", status);
      formData.append("is_featured", String(isFeatured));
      formData.append("is_popular", String(isPopular));
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (mode === "create") {
        await createEvent(formData);
      } else {
        if (!slug) {
          throw new Error("Missing slug for event update.");
        }
        await updateEvent(slug, formData);
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to submit event:", err);
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save event. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {mode === "create" ? "Create event" : "Edit event"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "create"
            ? "Fill out the details below to publish a new event."
            : "Update the event details below and save your changes."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700"
          >
            Event title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-slate-700"
            >
              Start date & time
            </label>
            <input
              id="start_date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-slate-700"
            >
              End date & time
            </label>
            <input
              id="end_date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-slate-700"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label
              htmlFor="contact_person"
              className="block text-sm font-medium text-slate-700"
            >
              Contact person
            </label>
            <input
              id="contact_person"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Enter contact person name"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Contact number */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium text-slate-700"
            >
              Contact number
            </label>
            <input
              id="contact_number"
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter contact number"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Published" | "Draft" | "Cancelled")
              }
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Flags */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <input
              id="is_featured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label
              htmlFor="is_featured"
              className="text-sm font-medium text-slate-700"
            >
              Featured event
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="is_popular"
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label
              htmlFor="is_popular"
              className="text-sm font-medium text-slate-700"
            >
              Popular event
            </label>
          </div>
        </div>

        {/* Description - Rich text editor */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Event description
          </label>
          <div className="mt-1 rounded-md border border-slate-200 bg-white">
            <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold")}
                className="rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic")}
                className="rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline")}
                className="rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("insertUnorderedList")}
                className="rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                • List
              </button>
            </div>
            <div
              ref={editorRef}
              onInput={handleEditorInput}
              contentEditable
              className="min-h-[120px] px-3 py-2 text-sm text-slate-800 outline-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            You can format text with bold, italics, underline and bullet lists.
          </p>
        </div>

        {/* Thumbnail */}
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-slate-700"
          >
            Thumbnail
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
          {initialData?.thumbnail && !thumbnailFile && (
            <p className="mt-1 text-xs text-slate-500">
              Current thumbnail:{" "}
              <span className="underline">existing file</span>
            </p>
          )}
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create event"
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
