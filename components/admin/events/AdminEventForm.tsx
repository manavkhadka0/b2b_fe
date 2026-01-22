"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Event, EventImage, EventOrganizer, Tag } from "@/types/events";
import {
  createEvent,
  updateEvent,
  getEventOrganizers,
  createEventOrganizer,
  getTags,
  addEventImages,
  deleteEventImage,
} from "@/services/events";
import Tiptap from "@/components/ui/tip-tap";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

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

  const editorRef = useRef<{ getContent: () => string } | null>(null);
  const calendarInitialized = useRef(false);

  // Helper function to convert Latin numerals to Devanagari numerals
  const toDevanagariNumerals = (str: string): string => {
    const latinToDevanagari: { [key: string]: string } = {
      '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
      '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
    };
    return str.replace(/[0-9]/g, (digit) => latinToDevanagari[digit] || digit);
  };

  // Helper function to convert Devanagari numerals to Latin numerals
  const toLatinNumerals = (str: string): string => {
    const devanagariToLatin: { [key: string]: string } = {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
      '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    return str.replace(/[०१२३४५६७८९]/g, (digit) => devanagariToLatin[digit] || digit);
  };

  // Fetch organizers and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgsData, tagsData] = await Promise.all([
          getEventOrganizers(),
          getTags(),
        ]);
        setOrganizers(orgsData);
        setTags(tagsData);
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
      try {
        const bsDate = adToBs(startDateStr);
        const bsDateDevanagari = toDevanagariNumerals(bsDate);
        setStartDateBs(bsDateDevanagari);
      } catch (error) {
        console.error("Error converting start date to BS:", error);
        setStartDateBs(startDateStr);
      }
    } else {
      setStartDateBs("");
    }
    
    // Extract and convert end date
    const endDateStr = extractDate(initialData.end_date ?? "");
    setEndDate(endDateStr);
    
    // Convert AD date to BS for display in date picker
    if (endDateStr) {
      try {
        const bsDate = adToBs(endDateStr);
        const bsDateDevanagari = toDevanagariNumerals(bsDate);
        setEndDateBs(bsDateDevanagari);
      } catch (error) {
        console.error("Error converting end date to BS:", error);
        setEndDateBs(endDateStr);
      }
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
    setIsPopular(initialData.is_popular ?? false);
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

        {/* Description - TipTap Editor */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Event description
          </Label>
          <Tiptap
            value={description}
            onChange={setDescription}
            placeholder="Enter event description..."
            toolbar="noImage"
            minHeight="350px"
            className="border border-slate-200"
          />
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-slate-700"
            >
              Start date (BS)
            </label>
            <div className="relative">
              <Calendar
                key={`start-${calendarKey}`}
                language="ne"
                dateFormat="YYYY-MM-DD"
                className="mt-1 w-full"
                inputClassName="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="YYYY-MM-DD"
                value={startDateBs}
                onChange={handleStartDateChange}
                theme="deepdark"
                defaultDate={toLatinNumerals(startDateBs) || undefined}
                hideDefaultValue={!startDateBs}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              BS: {startDateBs || "Not set"} | AD: {startDate || "Not set"}
            </p>
            {/* Manual input as fallback */}
            
          </div>
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-slate-700"
            >
              End date (BS)
            </label>
            <div className="relative">
              <Calendar
                key={`end-${calendarKey}`}
                language="ne"
                dateFormat="YYYY-MM-DD"
                className="mt-1 w-full"
                inputClassName="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="YYYY-MM-DD"
                value={endDateBs}
                onChange={handleEndDateChange}
                theme="deepdark"
                defaultDate={toLatinNumerals(endDateBs) || undefined}
                hideDefaultValue={!endDateBs}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              BS: {endDateBs || "Not set"} | AD: {endDate || "Not set"}
            </p>
            {/* Manual input as fallback */}
            
          </div>
        </div>

        {/* Location & Order */}
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
              htmlFor="order"
              className="block text-sm font-medium text-slate-700"
            >
              Order
            </label>
            <input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="0"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Event Organizer */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Event Organizer
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedOrganizer?.toString() ?? "__none__"}
              onValueChange={(value) => {
                if (value === "__none__") {
                  setSelectedOrganizer(null);
                  return;
                }
                setSelectedOrganizer(Number(value));
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select an organizer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {loadingOrganizers ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  organizers.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Dialog
              open={isCreateOrganizerOpen}
              onOpenChange={setIsCreateOrganizerOpen}
            >
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Event Organizer</DialogTitle>
                  <DialogDescription>
                    Add a new event organizer to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="org-name">Name *</Label>
                    <Input
                      id="org-name"
                      value={newOrganizerName}
                      onChange={(e) => setNewOrganizerName(e.target.value)}
                      placeholder="Organizer name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-email">Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      value={newOrganizerEmail}
                      onChange={(e) => setNewOrganizerEmail(e.target.value)}
                      placeholder="organizer@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-phone">Phone</Label>
                    <Input
                      id="org-phone"
                      value={newOrganizerPhone}
                      onChange={(e) => setNewOrganizerPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-address">Address</Label>
                    <Input
                      id="org-address"
                      value={newOrganizerAddress}
                      onChange={(e) => setNewOrganizerAddress(e.target.value)}
                      placeholder="Organizer address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-logo">Logo</Label>
                    <Input
                      id="org-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewOrganizerLogo(e.target.files?.[0] || null)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOrganizerOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateOrganizer}
                    disabled={creatingOrganizer || !newOrganizerName.trim()}
                  >
                    {creatingOrganizer ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid gap-4 md:grid-cols-2">
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

        {/* File Uploads */}
        <div className="grid gap-4 md:grid-cols-2">
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
          <div>
            <label
              htmlFor="event_file"
              className="block text-sm font-medium text-slate-700"
            >
              Event File
            </label>
            <input
              id="event_file"
              type="file"
              onChange={handleEventFileChange}
              className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {initialData?.event_file && !eventFile && (
              <p className="mt-1 text-xs text-slate-500">
                Current file: <span className="underline">existing file</span>
              </p>
            )}
          </div>
        </div>

        {mode === "edit" && initialData?.id && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">
                Event images
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsImagesDialogOpen(true);
                  setNewImages([]);
                  setImagesError(null);
                }}
              >
                Add images
              </Button>
            </div>

            {eventImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {eventImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative overflow-hidden rounded-md border bg-slate-50"
                  >
                    <img
                      src={img.image}
                      alt="Event image"
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={deletingImageId === img.id}
                      className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-white"
                    >
                      {deletingImageId === img.id ? "..." : "×"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No images uploaded for this event yet.
              </p>
            )}

            {imagesError && (
              <p className="text-sm text-rose-600">{imagesError}</p>
            )}
          </div>
        )}

        <Dialog
          open={isImagesDialogOpen}
          onOpenChange={(open) => {
            setIsImagesDialogOpen(open);
            if (!open) {
              setNewImages([]);
              setImagesError(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Add event images</DialogTitle>
              <DialogDescription>
                Upload one or more images for this event.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="event-new-images">Images</Label>
              <Input
                id="event-new-images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setNewImages(files);
                  setImagesError(null);
                }}
              />
              <p className="text-xs text-slate-500">
                Selected: {newImages.length || 0}
              </p>
              {imagesError && (
                <p className="text-sm text-rose-600">{imagesError}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImagesDialogOpen(false)}
                disabled={imagesLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddImages}
                disabled={imagesLoading || !initialData?.id}
              >
                {imagesLoading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

