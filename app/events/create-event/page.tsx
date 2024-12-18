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
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-2">
        Create Event
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Create a Type of Event you want to host
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Event Title"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Date & Time */}

        {/* Date & Type of Event */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="datetime"
              className="block text-sm font-medium text-gray-700"
            >
              Event Date & Time
            </label>
            <input
              id="datetime"
              name="datetime"
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              onFocus={(e) => e.target.showPicker()}
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type of Event
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </select>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter Location"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter Contact No."
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Event Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Event Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Description about Event"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Event Photos/ Videos
          </label>
          <div className="relative mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <IoCloudUploadOutline
              size={48}
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-gray-500 text-sm">Upload Photos</p>
            <span className="text-gray-400 text-xs mb-2">OR</span>
            <br />
            <button
              type="button"
              className="py-1 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Browse files
            </button>
          </div>
          {/* Image Previews */}
          <div className="mt-4 flex flex-wrap gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => discardImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
