"use client";

import { useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function useDeleteHandlers(
  mutateWishes: () => void,
  mutateOffers: () => void,
) {
  const [deletingWishId, setDeletingWishId] = useState<number | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<number | null>(null);

  const handleDeleteWish = async (id: number) => {
    try {
      setDeletingWishId(id);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(`${API_BASE}/api/wish_and_offers/wishes/${id}/`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete wish");
      }

      toast.success("Wish deleted successfully");
      mutateWishes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wish");
    } finally {
      setDeletingWishId(null);
    }
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      setDeletingOfferId(id);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(`${API_BASE}/api/wish_and_offers/offers/${id}/`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete offer");
      }

      toast.success("Offer deleted successfully");
      mutateOffers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete offer");
    } finally {
      setDeletingOfferId(null);
    }
  };

  return {
    deletingWishId,
    deletingOfferId,
    handleDeleteWish,
    handleDeleteOffer,
  };
}
