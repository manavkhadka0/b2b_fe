"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Wish, Offer } from "@/types/wish";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function useEditData() {
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingWishData, setEditingWishData] = useState<Wish | null>(null);
  const [editingOfferData, setEditingOfferData] = useState<Offer | null>(null);
  const [loadingEditData, setLoadingEditData] = useState(false);

  // Fetch full wish/offer data when editing
  useEffect(() => {
    const fetchEditData = async () => {
      if (editingWish && !editingWishData) {
        setLoadingEditData(true);
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("accessToken")
              : null;

          const response = await fetch(
            `${API_BASE}/api/wish_and_offers/wishes/${editingWish.id}/`,
            {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : undefined,
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch wish details");
          }

          const data = await response.json();
          setEditingWishData(data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load wish details");
          setEditingWish(null);
        } finally {
          setLoadingEditData(false);
        }
      } else if (editingOffer && !editingOfferData) {
        setLoadingEditData(true);
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("accessToken")
              : null;

          const response = await fetch(
            `${API_BASE}/api/wish_and_offers/offers/${editingOffer.id}/`,
            {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : undefined,
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch offer details");
          }

          const data = await response.json();
          setEditingOfferData(data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load offer details");
          setEditingOffer(null);
        } finally {
          setLoadingEditData(false);
        }
      }
    };

    fetchEditData();
  }, [editingWish, editingOffer, editingWishData, editingOfferData]);

  const openEditWish = (wish: Wish) => {
    setEditingWish(wish);
    setEditingOffer(null);
    setEditingWishData(null);
    setEditingOfferData(null);
  };

  const openEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditingWish(null);
    setEditingWishData(null);
    setEditingOfferData(null);
  };

  const closeEditDialog = () => {
    setEditingWish(null);
    setEditingOffer(null);
    setEditingWishData(null);
    setEditingOfferData(null);
  };

  return {
    editingWish,
    editingOffer,
    editingWishData,
    editingOfferData,
    loadingEditData,
    openEditWish,
    openEditOffer,
    closeEditDialog,
  };
}
