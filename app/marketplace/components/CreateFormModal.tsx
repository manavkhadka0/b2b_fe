"use client";

import React from "react";
import { X } from "lucide-react";
import { CreateWishOfferFormSimplified } from "@/components/sections/create-wish/create-wish-form-simplified";
import type { Wish, Offer } from "@/types/wish";

function getCategoryId(item: Wish | Offer): string {
  if (item.product?.category?.id) {
    return item.product.category.id.toString();
  }
  const service = item.service;
  if (
    service &&
    typeof service === "object" &&
    "category" in service &&
    service.category?.id
  ) {
    return service.category.id.toString();
  }
  return "";
}

import { useAuth } from "@/contexts/AuthContext";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";

export type CreateFormModalProps = {
  formType: "wishes" | "offers";
  relatedItem: Wish | Offer;
  relatedItemId: number | null;
  onClose: () => void;
};

export const CreateFormModal: React.FC<CreateFormModalProps> = ({
  formType,
  relatedItem,
  relatedItemId,
  onClose,
}) => {
  const { user } = useAuth();

  const initialValues = {
    wish_id:
      formType === "offers" && relatedItemId
        ? relatedItemId.toString()
        : undefined,
    offer_id:
      formType === "wishes" && relatedItemId
        ? relatedItemId.toString()
        : undefined,
    type: (relatedItem.product ? "Product" : "Service") as
      | "Product"
      | "Service",
    product: relatedItem.product?.id?.toString() || "",
    service: relatedItem.service?.id?.toString() || "",
    title: relatedItem.title || "",
    description: relatedItem.description || "",
    category: getCategoryId(relatedItem),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8 relative max-h-[90vh] overflow-y-auto shadow-lg border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <CreateWishOfferFormSimplified
            is_wish_or_offer={formType}
            onClose={onClose}
            initialValues={initialValues}
          />
        </div>
      </div>
    </div>
  );
};
