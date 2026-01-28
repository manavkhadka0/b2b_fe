"use client";

import React from "react";
import { Search } from "lucide-react";
import { Offer } from "@/types/wish";
import { OfferItem } from "./OfferItem";

interface OfferListProps {
  offers: Offer[];
}

export function OfferList({ offers }: OfferListProps) {
  if (offers.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <h4 className="text-base font-semibold text-gray-800 mb-1">
          No offers found
        </h4>
        <p className="text-gray-500 text-sm">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {offers.map((offer) => (
        <OfferItem key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
