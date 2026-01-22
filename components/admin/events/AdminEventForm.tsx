"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Event, EventImage, EventOrganizer, Tag } from "@/types/events";
import {
  createEvent,
  updateEvent,
  getEventOrganizers,
  createEventOrganizer,
  addEventImages,
  deleteEventImage,
} from "@/services/events";
import { convertAdToBs } from "@/lib/nepali-date";

// Sub-components
import BasicInfoSection from "./form/BasicInfoSection";
import DateLocationSection from "./form/DateLocationSection";
import OrganizerSection from "./form/OrganizerSection";
import MediaSection from "./form/MediaSection";
import SettingsSection from "./form/SettingsSection";

type AdminEventFormMode = "create" | "edit";

interface AdminEventFormProps {
  mode: AdminEventFormMode;
  initialData?: Partial<Event> | null;
  slug?: string;
}

export default function AdminEventForm({
  mode,
  initialData,
  slug,
}: AdminEventFormProps) {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Store English (AD) date for backend, but show Nepali (BS) in UI
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateBs, setStartDateBs] = useState("");
  const [endDateBs, setEndDateBs] = useState("");
  const [calendarKey, setCalendarKey] = useState(Date.now());

  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft" | "Cancelled">(
    "Published"
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [order, setOrder] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<number | null>(
    null
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [eventFile, setEventFile] = useState<File | null>(null);

  const [eventImages, setEventImages] = useState<EventImage[]>([]);

  // Data fetching state
  const [organizers, setOrganizers] = useState<EventOrganizer[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  // Create organizer dialog state
  const [isCreateOrganizerOpen, setIsCreateOrganizerOpen] = useState(false);
  const [newOrganizerName, setNewOrganizerName] = useState("");
  const [newOrganizerEmail, setNewOrganizerEmail] = useState("");
  const [newOrganizerPhone, setNewOrganizerPhone] = useState("");
  const [newOrganizerAddress, setNewOrganizerAddress] = useState("");
  const [newOrganizerLogo, setNewOrganizerLogo] = useState<File | null>(null);
  const [creatingOrganizer, setCreatingOrganizer] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isImagesDialogOpen, setIsImagesDialogOpen] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  const calendarInitialized = useRef(false);

  // Fetch organizers and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgsData] = await Promise.all([
          getEventOrganizers(),
        ]);
        setOrganizers(orgsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoadingOrganizers(false);
        setLoadingTags(false);
      }
    };
    fetchData();
  }, []);

  // Helper function to extract date from backend format (handles date with or without time)
  const extractDate = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";
    
    // Handle various formats: "YYYY-MM-DD HH:MM", "YYYY-MM-DDTHH:MM", "YYYY-MM-DD", etc.
    const dateTime = dateTimeStr.trim();
    const spaceIndex = dateTime.indexOf(" ");
    const tIndex = dateTime.indexOf("T");
    
    if (spaceIndex > 0) {
      return dateTime.substring(0, spaceIndex);
    } else if (tIndex > 0) {
      return dateTime.substring(0, tIndex);
    } else {
      return dateTime;
    }
  };

  // Initialize form with initial data
  useEffect(() => {
    if (!initialData || calendarInitialized.current) return;

    setTitle(initialData.title ?? "");
    setDescription(initialData.description ?? "");
    
    // Extract and convert start date
    const startDateStr = extractDate(initialData.start_date ?? "");
    setStartDate(startDateStr);
    
    // Convert AD date to BS for display in date picker
    if (startDateStr) {
      setStartDateBs(convertAdToBs(startDateStr));
    } else {
      setStartDateBs("");
    }
    
    // Extract and convert end date
    const endDateStr = extractDate(initialData.end_date ?? "");
    setEndDate(endDateStr);
    
    // Convert AD date to BS for display in date picker
    if (endDateStr) {
        setEndDateBs(convertAdToBs(endDateStr));
    } else {
        setEndDateBs("");
    }
  
    setLocation(initialData.location ?? "");
    setContactPerson(initialData.contact_person ?? "");
    setContactNumber(initialData.contact_number ?? "");
    setStatus(
      (initialData.status as "Published" | "Draft" | "Cancelled") ?? "Published"
    );
    setIsFeatured(initialData.is_featured ?? false);
    setIsPopular(initialData.is_popular ?? false); // Assuming is_popular is in Event type, but code had it.
    setOrder(initialData.order ?? 0);
    if (initialData.tags) {
      setSelectedTags(initialData.tags.map((tag) => tag.id));
    }
    if (initialData.event_organizer) {
      setSelectedOrganizer(initialData.event_organizer.id);
    }
    if (initialData.images) {
      setEventImages(initialData.images);
    }
    
    // Force calendar to re-initialize with the correct date
    setCalendarKey(Date.now());
    calendarInitialized.current = true;
    
  }, [initialData]);

  const handleAddImages = async () => {
    if (mode !== "edit" || !initialData?.id) return;
    if (newImages.length === 0) {
      setImagesError("Please select at least one image.");
      return;
    }

    setImagesLoading(true);
    setImagesError(null);
    try {
      const response: any = await addEventImages(initialData.id, newImages);
      if (Array.isArray(response)) {
        setEventImages((prev) => [...prev, ...response]);
      } else if (response?.images && Array.isArray(response.images)) {
        setEventImages(response.images);
      }
      setIsImagesDialogOpen(false);
      setNewImages([]);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to upload images. Please try again.";
      setImagesError(message);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (mode !== "edit") return;
    setDeletingImageId(imageId);
    setImagesError(null);
    try {
      await deleteEventImage(imageId);
      setEventImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete image. Please try again.";
      setImagesError(message);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
  };

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEventFile(file);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateOrganizer = async () => {
    if (!newOrganizerName.trim()) {
      setError("Organizer name is required");
      return;
    }

    setCreatingOrganizer(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", newOrganizerName);
      if (newOrganizerEmail) formData.append("email", newOrganizerEmail);
      if (newOrganizerPhone) formData.append("phone", newOrganizerPhone);
      if (newOrganizerAddress) formData.append("address", newOrganizerAddress);
      if (newOrganizerLogo) formData.append("logo", newOrganizerLogo);

      const created = await createEventOrganizer(formData);
      setOrganizers((prev) => [...prev, created]);
      setSelectedOrganizer(created.id);
      setIsCreateOrganizerOpen(false);
      // Reset form
      setNewOrganizerName("");
      setNewOrganizerEmail("");
      setNewOrganizerPhone("");
      setNewOrganizerAddress("");
      setNewOrganizerLogo(null);
    } catch (err: any) {
      console.error("Failed to create organizer:", err);
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create organizer. Please try again.";
      setError(message);
    } finally {
      setCreatingOrganizer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // Send only date in YYYY-MM-DD format
      if (startDate) {
        formData.append("start_date", startDate);
      }
      if (endDate) {
        formData.append("end_date", endDate);
      }
      formData.append("location", location);
      formData.append("contact_person", contactPerson);
      formData.append("contact_number", contactNumber);
      formData.append("status", status);
      formData.append("is_featured", String(isFeatured));
      formData.append("is_popular", String(isPopular));
      formData.append("order", String(order));
      if (selectedOrganizer) {
        formData.append("event_organizer", String(selectedOrganizer));
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      if (eventFile) {
        formData.append("event_file", eventFile);
      }
      // Add tags
      selectedTags.forEach((tagId) => {
        formData.append("tags", String(tagId));
      });

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

  // Handle calendar date change
  const handleStartDateChange = ({ bsDate, adDate }: { bsDate: string; adDate: string }) => {
    setStartDateBs(bsDate);
    setStartDate(adDate || "");
  };

  const handleEndDateChange = ({ bsDate, adDate }: { bsDate: string; adDate: string }) => {
    setEndDateBs(bsDate);
    setEndDate(adDate || "");
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
        {/* Basic Info */}
        <BasicInfoSection
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />

        {/* Date & Location */}
        <DateLocationSection
          startDateBs={startDateBs}
          handleStartDateChange={handleStartDateChange}
          startDateAd={startDate}
          endDateBs={endDateBs}
          handleEndDateChange={handleEndDateChange}
          endDateAd={endDate}
          location={location}
          setLocation={setLocation}
          order={order}
          setOrder={setOrder}
          calendarKey={calendarKey}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
        />

        {/* Organizer */}
        <OrganizerSection
          selectedOrganizer={selectedOrganizer}
          setSelectedOrganizer={setSelectedOrganizer}
          organizers={organizers}
          loadingOrganizers={loadingOrganizers}
          isCreateOrganizerOpen={isCreateOrganizerOpen}
          setIsCreateOrganizerOpen={setIsCreateOrganizerOpen}
          newOrganizerName={newOrganizerName}
          setNewOrganizerName={setNewOrganizerName}
          newOrganizerEmail={newOrganizerEmail}
          setNewOrganizerEmail={setNewOrganizerEmail}
          newOrganizerPhone={newOrganizerPhone}
          setNewOrganizerPhone={setNewOrganizerPhone}
          newOrganizerAddress={newOrganizerAddress}
          setNewOrganizerAddress={setNewOrganizerAddress}
          setNewOrganizerLogo={setNewOrganizerLogo}
          handleCreateOrganizer={handleCreateOrganizer}
          creatingOrganizer={creatingOrganizer}
        />

        {/* Settings (Status, Flags, Tags) */}
        <SettingsSection
          status={status}
          setStatus={setStatus}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isPopular={isPopular}
          setIsPopular={setIsPopular}
          tags={tags}
          selectedTags={selectedTags}
          handleTagToggle={handleTagToggle}
        />

        {/* Media */}
        <MediaSection
          mode={mode}
          initialData={initialData}
          thumbnailFile={thumbnailFile}
          handleThumbnailChange={handleThumbnailChange}
          eventFile={eventFile}
          handleEventFileChange={handleEventFileChange}
          eventImages={eventImages}
          isImagesDialogOpen={isImagesDialogOpen}
          setIsImagesDialogOpen={setIsImagesDialogOpen}
          newImages={newImages}
          setNewImages={setNewImages}
          imagesLoading={imagesLoading}
          imagesError={imagesError}
          setImagesError={setImagesError}
          deletingImageId={deletingImageId}
          handleDeleteImage={handleDeleteImage}
          handleAddImages={handleAddImages}
        />

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
