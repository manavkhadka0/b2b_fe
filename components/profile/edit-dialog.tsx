"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";
import type { Wish, Offer } from "@/types/wish";
import type { CreateWishFormValues } from "@/types/create-wish-type";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface EditDialogProps {
  editingWish: Wish | null;
  editingOffer: Offer | null;
  editingWishData: Wish | null;
  editingOfferData: Offer | null;
  loadingEditData: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
}

// Map wish/offer data to form initial values
function mapToInitialValues(data: Wish | Offer): Partial<CreateWishFormValues> {
  // Handle category extraction - product has category, service might have category (in Offer type)
  let categoryId = "";
  if (data.product?.category?.id) {
    categoryId = data.product.category.id.toString();
  } else if (
    data.service &&
    typeof data.service === "object" &&
    "category" in data.service &&
    data.service.category &&
    typeof data.service.category === "object" &&
    "id" in data.service.category
  ) {
    categoryId = data.service.category.id.toString();
  }

  return {
    title: data.title || "",
    type: (data.type === "Product" || data.type === "Service"
      ? data.type
      : "Product") as "Product" | "Service",
    product: data.product?.id?.toString() || "",
    service: data.service?.id?.toString() || "",
    category: categoryId,
    subcategory: "", // Will be set based on product/service - may need to fetch separately
    description: data.description || "",
    full_name: data.full_name || "",
    designation: data.designation || "",
    email: data.email || "",
    mobile_no: data.mobile_no || "",
    alternate_no: data.alternate_no || "",
    company_name: data.company_name || "",
    company_website: data.company_website || "",
    country: (data.country === "Nepal" ? "Nepal" : "Others") as
      | "Nepal"
      | "Others",
    address: data.address || "",
    province: data.province || "",
    district: "", // May need to fetch from API if available
    municipality: data.municipality || "",
    ward: data.ward || "",
    event_id: "event" in data ? data.event?.toString() : "",
  };
}

export function EditDialog({
  editingWish,
  editingOffer,
  editingWishData,
  editingOfferData,
  loadingEditData,
  onClose,
  onEditSuccess,
}: EditDialogProps) {
  const isOpen = !!editingWish || !!editingOffer;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-6xl w-[95%] max-h-[90vh] overflow-y-auto p-0">
        {loadingEditData ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : editingWish && editingWishData ? (
          <div className="p-4 md:p-6">
            <CreateWishOfferForm
              is_wish_or_offer="wishes"
              mode="edit"
              existingId={editingWish.id}
              initialValues={mapToInitialValues(editingWishData)}
              onClose={onEditSuccess}
            />
          </div>
        ) : editingOffer && editingOfferData ? (
          <div className="p-4 md:p-6">
            <CreateWishOfferForm
              is_wish_or_offer="offers"
              mode="edit"
              existingId={editingOffer.id}
              initialValues={mapToInitialValues(editingOfferData)}
              onClose={onEditSuccess}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
