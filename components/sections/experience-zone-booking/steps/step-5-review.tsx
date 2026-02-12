"use client";

import { UseFormReturn } from "react-hook-form";
import type {
  ExperienceZoneBookingFormValues,
  HSCode,
  Service,
} from "@/types/experience-zone-booking-type";

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

interface ZoneStep5ReviewProps {
  form: UseFormReturn<ExperienceZoneBookingFormValues>;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
}

export function ZoneStep5Review({
  form,
  selectedProduct,
  selectedService,
}: ZoneStep5ReviewProps) {
  const values = form.getValues();

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Review Your Booking</h2>

      <div className="space-y-6">
        {/* Display Details */}
        <div className="space-y-2">
          <h3 className="font-medium">Display Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p className="font-medium">{values.type}</p>
            </div>
            {values.type === "Product" && selectedProduct && (
              <div>
                <span className="text-sm text-gray-500">Product:</span>
                <p className="font-medium">
                  {selectedProduct.hs_code} - {selectedProduct.description}
                </p>
              </div>
            )}
            {values.type === "Service" && selectedService && (
              <div>
                <span className="text-sm text-gray-500">Service:</span>
                <p className="font-medium">
                  {selectedService.name} ({selectedService.category?.name})
                </p>
              </div>
            )}
            {values.preferred_month && (
              <div>
                <span className="text-sm text-gray-500">Preferred Month:</span>
                <p className="font-medium">
                  {(() => {
                    const [y, m] = values.preferred_month.split("-");
                    const mo = MONTHS.find((x) => x.value === m);
                    return `${mo?.label || m} ${y}`;
                  })()}
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
              <span className="text-sm text-gray-500">Contact Person:</span>
              <p className="font-medium">{values.contact_person}</p>
            </div>
            {values.designation && (
              <div>
                <span className="text-sm text-gray-500">Designation:</span>
                <p className="font-medium">{values.designation}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{values.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone Number:</span>
              <p className="font-medium">{values.phone}</p>
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
            {values.country && (
              <div>
                <span className="text-sm text-gray-500">Country:</span>
                <p className="font-medium">{values.country}</p>
              </div>
            )}
            <div className="col-span-full">
              <span className="text-sm text-gray-500">Address:</span>
              <p className="font-medium">{values.address}</p>
            </div>
            {values.province && (
              <div>
                <span className="text-sm text-gray-500">Province:</span>
                <p className="font-medium">{values.province}</p>
              </div>
            )}
            {values.district && (
              <div>
                <span className="text-sm text-gray-500">District:</span>
                <p className="font-medium">{values.district}</p>
              </div>
            )}
            {values.municipality && (
              <div>
                <span className="text-sm text-gray-500">Municipality:</span>
                <p className="font-medium">{values.municipality}</p>
              </div>
            )}
            {values.ward && (
              <div>
                <span className="text-sm text-gray-500">Ward:</span>
                <p className="font-medium">{values.ward}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
