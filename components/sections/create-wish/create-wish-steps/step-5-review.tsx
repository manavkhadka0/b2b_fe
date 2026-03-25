"use client";

import { UseFormReturn } from "react-hook-form";
import type {
  CreateWishFormValues,
  HSCode,
  Service,
} from "@/types/create-wish-type";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Step5ReviewProps {
  form: UseFormReturn<CreateWishFormValues>;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
  image: { url: string } | null;
  is_wish_or_offer: "wishes" | "offers";
}

export function Step5Review({
  form,
  selectedProduct,
  selectedService,
  image,
  is_wish_or_offer,
}: Step5ReviewProps) {
  const values = form.getValues();
  const listingLabel = is_wish_or_offer === "wishes" ? "wish" : "offer";

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">
        Review Your {is_wish_or_offer === "wishes" ? "Wish" : "Offer"}
      </h2>

      <div className="space-y-6">
        {/* Wish Details */}
        <div className="space-y-2">
          <h3 className="font-medium">Wish Details</h3>
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
              <p className="font-medium">{values.designation}</p>
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

        {/* Images */}
        {image && (
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img
                src={image.url}
                alt="Uploaded Image"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="public_display_consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              </FormControl>
              <div className="space-y-1 leading-snug">
                <FormLabel className="text-sm font-normal text-slate-700 cursor-pointer">
                  I understand and agree that this {listingLabel} and my
                  contact details may be displayed publicly on the Birat Bazaar
                  website so other members can respond.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
