"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoCloudUploadOutline } from "react-icons/io5";
import { z } from "zod";
import ProductServiceSelector from "@/app/ProductServiceSelector";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  full_name: z.string().nonempty("Full name is required"),
  designation: z.string().nonempty("Designation is required"),
  mobile_no: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits")
    .nonempty("Mobile number is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  address: z.string().nonempty("Address is required"),
  company_name: z.string().nonempty("Company name is required"),
  country: z.string().nonempty("Country is required"),
  province: z.string().nonempty("Province is required"),
  municipality: z.string().nonempty("Municipality is required"),
  ward: z.string().nonempty("Ward is required"),
  offer_type: z.string().nonempty("Offer type is required"),
  status: z.string().nonempty("Status is required"),
});

const designationOptions = [
  { value: "CEO", label: "Chief Executive Officer" },
  { value: "CFO", label: "Chief Financial Officer" },
  { value: "CTO", label: "Chief Technology Officer" },
  { value: "CMO", label: "Chief Marketing Officer" },
  { value: "COO", label: "Chief Operating Officer" },
  { value: "CIO", label: "Chief Information Officer" },
  { value: "CSO", label: "Chief Security Officer" },
  { value: "Other", label: "Other" },
];

export default function OfferForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    event: "",
    product: "",
    service: "",
    status: "",
    offer_type: "",
    full_name: "",
    designation: "",
    mobile_no: "",
    alternate_no: "",
    email: "",
    company_name: "",
    address: "",
    country: "Nepal",
    province: "",
    municipality: "",
    ward: "",
    company_website: "",
    image: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductService, setSelectedProductService] = useState("");
  const [designationDropdownOpen, setDesignationDropdownOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleSelect = (selectedItem: string) => {
    setSelectedProductService(selectedItem);
    setFormData((prev) => ({
      ...prev,
      product: formData.offer_type === "Product" ? selectedItem : prev.product,
      service: formData.offer_type === "Service" ? selectedItem : prev.service,
    }));
  };

  const handleDesignationSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, designation: value }));
    setDesignationDropdownOpen(false);
    setErrors((prev) => ({ ...prev, designation: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate using Zod
      formSchema.parse(formData);
      setErrors({});
      const formDataToSend = {
        ...formData,
        image: null, // Replace with file URL if required
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
        formDataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Offer Created Successfully!", response.data);
      alert("Offer Created Successfully!");
      window.location.reload();
      router.push("/wishOffer");
    } catch (err: any) {
      if (err.response) {
        console.error("Backend Error:", err.response.data);
        alert(`Error: ${err.response.data.message || "Submission failed"}`);
      } else if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Submission Error:", err);
        alert("An error occurred while submitting the form.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-2">
        Create offer
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Create a Type of offer you want to host
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="full_name"
              name="full_name" // Ensure this matches the formData key
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.full_name && ( // Update error reference to match schema
              <p className="text-red-500 text-sm">{errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Contact No */}
          <div>
            <label
              htmlFor="mobile_no"
              className="block text-sm font-medium text-gray-700"
            >
              Contact No
            </label>
            <input
              id="mobile_no"
              name="mobile_no"
              type="text"
              value={formData.mobile_no}
              onChange={handleInputChange}
              placeholder="Enter Your Phone Number"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.mobile_no && (
              <p className="text-red-500 text-sm">{errors.mobile_no}</p>
            )}
          </div>

          {/* Alternate Phone */}
          <div>
            <label
              htmlFor="alternate_no"
              className="block text-sm font-medium text-gray-700"
            >
              Alternate Phone
            </label>
            <input
              id="alternate_no"
              name="alternate_no"
              type="text"
              value={formData.alternate_no}
              onChange={handleInputChange}
              placeholder="Enter Alternate Phone Number"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.alternate_no && (
              <p className="text-red-500 text-sm">{errors.alternate_no}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Designation */}
          <div className="relative mt-1">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Designation
            </label>
            <div
              className="border border-gray-300 rounded-md p-3 cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={() => setDesignationDropdownOpen((prev) => !prev)}
            >
              {formData.designation
                ? designationOptions.find(
                    (option) => option.value === formData.designation
                  )?.label
                : "Select a Designation"}
            </div>
            {designationDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {designationOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleDesignationSelect(option.value)}
                    className="p-3 hover:bg-purple-100 cursor-pointer"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter Your Address"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="Enter Company Name"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm">{errors.company_name}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter Country"
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700"
              >
                Province
              </label>
              <input
                id="province"
                name="province"
                type="text"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Enter Province"
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="municipality"
                className="block text-sm font-medium text-gray-700"
              >
                Municipality
              </label>
              <input
                id="municipality"
                name="municipality"
                type="text"
                value={formData.municipality}
                onChange={handleInputChange}
                placeholder="Enter Municipality"
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.municipality && (
                <p className="text-red-500 text-sm">{errors.municipality}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="ward"
                className="block text-sm font-medium text-gray-700"
              >
                Ward
              </label>
              <input
                id="ward"
                name="ward"
                type="text"
                value={formData.ward}
                onChange={handleInputChange}
                placeholder="Enter Ward"
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.ward && (
                <p className="text-red-500 text-sm">{errors.ward}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="company_website"
              className="block text-sm font-medium text-gray-700"
            >
              Company Website
            </label>
            <input
              id="company_website"
              name="company_website"
              type="url"
              value={formData.company_website}
              onChange={handleInputChange}
              placeholder="Enter Company Website"
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.company_website && (
              <p className="text-red-500 text-sm">{errors.company_website}</p>
            )}
          </div>
        </div>
        <div>
          <label>offer Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter offer Title"
            className="w-full border border-gray-300 rounded-md p-3 mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Category and Product Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="offer_type"
              className="block text-sm font-medium text-gray-700"
            >
              offer Type
            </label>
            <select
              id="offer_type"
              name="offer_type"
              value={formData.offer_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select offer Type</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
            {errors.offer_type && (
              <p className="text-red-500 text-sm">{errors.offer_type}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="wish_type"
              className="block text-sm font-medium text-gray-700"
            >
              Choose {formData.offer_type === "Product" ? "Product" : "Service"}
            </label>
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              disabled={!formData.offer_type}
              className="bg-purple-600 text-white py-2 px-4 rounded-md"
            >
              Select {formData.offer_type || "Option"}
            </button>
            {isPopupOpen && (
              <ProductServiceSelector
                wishType={formData.offer_type}
                onClose={() => setIsPopupOpen(false)}
                onSelect={handleSelect}
              />
            )}

            {selectedProductService && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  Selected: <strong>{selectedProductService}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>

        {/* offer Description */}

        {/* File Upload */}
        {!isPopupOpen && (
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Photos/Videos
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
              <p className="text-gray-500 text-sm">Upload Photos/Videos</p>
            </div>
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
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Create Offer
          </button>
        </div>
      </form>
    </div>
  );
}
