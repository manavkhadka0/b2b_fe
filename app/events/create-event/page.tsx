"use client";

import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function EventForm() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "",
    location: "",
    contact: "",
    description: "",
    datetime: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, datetime: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setPreviews((prev) => [...prev, ...filePreviews]);
    }
  };

  const discardImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Event Created Successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <div className="w-full rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Create event</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create the type of event you want to host.
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
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter event title"
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Date & Type of Event */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="datetime"
              className="block text-sm font-medium text-slate-700"
            >
              Event date & time
            </label>
            <input
              id="datetime"
              name="datetime"
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              onFocus={(e) => e.target.showPicker()}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-700"
            >
              Type of event
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </select>
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
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-slate-700"
            >
              Contact number
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter contact number"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Event Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Event description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description about the event"
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-slate-700"
          >
            Event photos / videos
          </label>
          <div className="relative mt-2 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <IoCloudUploadOutline size={40} className="mb-2 text-slate-400" />
            <p className="text-sm text-slate-700">Upload photos</p>
            <p className="mt-1 text-xs text-slate-400">
              Drag and drop or click to browse files
            </p>
          </div>
          {/* Image Previews */}
          <div className="mt-4 flex flex-wrap gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => discardImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800"
          >
            Create event
          </button>
        </div>
      </form>
    </div>
  );
}
