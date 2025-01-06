"use client";

import { UseFormReturn } from "react-hook-form";
import type {
  CreateWishFormValues,
  HSCode,
  Service,
} from "@/types/create-wish-type";
import { designationOptions } from "@/types/schemas/create-wish-schemas";

interface Step5ReviewProps {
  form: UseFormReturn<CreateWishFormValues>;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
  images: { url: string }[];
}

export function Step5Review({
  form,
  selectedProduct,
  selectedService,
  images,
}: Step5ReviewProps) {
  const values = form.getValues();
  const designation = designationOptions.find(
    (option) => option.value === values.designation
  );

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Review Your Wish</h2>

      <div className="space-y-6">
        {/* Wish Details */}
        <div className="space-y-2">
          <h3 className="font-medium">Wish Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p className="font-medium">{values.wish_type}</p>
            </div>
            {values.wish_type === "Product" && selectedProduct && (
              <div>
                <span className="text-sm text-gray-500">Product:</span>
                <p className="font-medium">
                  {selectedProduct.hs_code} - {selectedProduct.description}
                </p>
              </div>
            )}
            {values.wish_type === "Service" && selectedService && (
              <div>
                <span className="text-sm text-gray-500">Service:</span>
                <p className="font-medium">
                  {selectedService.name} ({selectedService.category?.name})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p className="font-medium">{values.full_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Designation:</span>
              <p className="font-medium">{designation?.label}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{values.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Mobile Number:</span>
              <p className="font-medium">{values.mobile_no}</p>
            </div>
            {values.alternate_no && (
              <div>
                <span className="text-sm text-gray-500">Alternate Number:</span>
                <p className="font-medium">{values.alternate_no}</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Company Name:</span>
              <p className="font-medium">{values.company_name}</p>
            </div>
            {values.company_website && (
              <div>
                <span className="text-sm text-gray-500">Website:</span>
                <p className="font-medium">{values.company_website}</p>
              </div>
            )}
            <div className="col-span-full">
              <span className="text-sm text-gray-500">Address:</span>
              <p className="font-medium">{values.address}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Province:</span>
              <p className="font-medium">{values.province}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Municipality:</span>
              <p className="font-medium">{values.municipality}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Ward:</span>
              <p className="font-medium">{values.ward}</p>
            </div>
          </div>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
