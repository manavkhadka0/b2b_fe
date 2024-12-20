"use client";

import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { z } from "zod";

export default function EventForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    productCode: "",
    location: "",
    contact: "",
    description: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = [
    { value: "products", label: "Products" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  // Zod Schema for validation
  const formSchema = z.object({
    title: z.string().nonempty("Title is required."),
    category: z.enum(["products", "service", "other"], {
      errorMap: () => ({ message: "Category is required." }),
    }),
    productCode: z
      .string()
      .regex(/^#/, "Product code must start with '#'")
      .optional()
      .refine(
        (value) => formData.category !== "service" || !value,
        "Product code is not allowed for 'service' category."
      ),
    location: z.string().nonempty("Location is required."),
    contact: z.string().nonempty("Contact is required."),
    description: z.string().optional(),
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user types
  };

  const handleCategorySelect = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setDropdownOpen(false);
    setErrors((prev) => ({ ...prev, category: "" })); // Clear category error
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
    try {
      // Validate the form data
      formSchema.parse(formData);
      console.log("Wish Created Successfully!");
      console.log("Validated Form Data:", formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-2">
        Create Wish
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Create a Type of Wish you want to host
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wish Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Wish Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Wish Title"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Category and Product Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Wish Category
            </label>
            <div className="relative mt-1">
              <div
                className="border border-gray-300 rounded-md p-3 cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {formData.category
                  ? categories.find((cat) => cat.value === formData.category)
                      ?.label
                  : "Select a Category"}
              </div>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {categories.map((category) => (
                    <div
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      className="p-3 hover:bg-purple-100 cursor-pointer"
                    >
                      {category.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="productCode"
              className="block text-sm font-medium text-gray-700"
            >
              Product Code
            </label>
            <input
              id="productCode"
              name="productCode"
              type="text"
              value={formData.productCode}
              onChange={handleInputChange}
              placeholder="Enter Product Code (e.g., #f234647)"
              disabled={formData.category === "service"}
              className={`w-full border ${
                formData.category === "service"
                  ? "border-gray-300 bg-gray-100"
                  : "border-gray-300"
              } rounded-md p-3 mt-1 focus:outline-none focus:ring-2 ${
                formData.category !== "service" ? "focus:ring-purple-500" : ""
              }`}
            />
            {errors.productCode && (
              <p className="text-red-500 text-sm">{errors.productCode}</p>
            )}
          </div>
        </div>

        {/* Wish Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Wish Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Description about Wish"
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
            Wish Photos/ Videos
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
            Create Wish
          </button>
        </div>
      </form>
    </div>
  );
}
