"use client";

import { useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface ConvertParams {
  sourceType: "wish" | "offer";
  sourceId: number;
  targetType: "wish" | "offer";
}

export function useConvertHandler(
  mutateWishes: () => void,
  mutateOffers: () => void,
) {
  const [isConverting, setIsConverting] = useState(false);
  const [convertingId, setConvertingId] = useState<number | null>(null);

  const convertItem = async ({
    sourceType,
    sourceId,
    targetType,
  }: ConvertParams) => {
    setIsConverting(true);
    setConvertingId(sourceId);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        throw new Error("You must be logged in to convert items");
      }

      const response = await fetch(
        `${API_BASE}/api/wish_and_offers/convert-data/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            source_type: sourceType,
            source_id: sourceId,
            target_type: targetType,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `Failed to convert ${sourceType} to ${targetType}`,
        );
      }

      const data = await response.json();

      toast.success(
        `${sourceType === "wish" ? "Wish" : "Offer"} converted to ${
          targetType === "wish" ? "wish" : "offer"
        } successfully!`,
      );

      // Refresh both lists to show updated data
      mutateWishes();
      mutateOffers();

      return data;
    } catch (error) {
      console.error("Conversion error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to convert ${sourceType} to ${targetType}`;
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsConverting(false);
      setConvertingId(null);
    }
  };

  return {
    convertItem,
    isConverting,
    convertingId,
  };
}
