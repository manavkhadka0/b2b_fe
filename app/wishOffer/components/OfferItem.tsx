"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Offer } from "@/types/wish";

interface OfferItemProps {
  offer: Offer;
}

export function OfferItem({ offer }: OfferItemProps) {
  return (
    <div className="p-4 md:p-5 hover:bg-green-50/[0.02] transition-colors group">
      <div className="flex flex-col md:flex-row gap-4">
        {offer.image && (
          <div className="relative w-full md:w-48 h-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-white/95 text-green-600 border-none px-2 py-0.5 text-[10px] font-semibold uppercase">
                {offer.type}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <Link
              href={`/wishOffer/offer/${offer.id}`}
              className="flex-1 min-w-0"
            >
              {!offer.image && (
                <Badge className="mb-1.5 bg-green-50 text-green-600 border-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {offer.type}
                </Badge>
              )}
              <h3 className="font-semibold text-base md:text-lg text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                {offer.title}
              </h3>
            </Link>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {offer.description || "No description provided for this offer."}
          </p>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-green-500" />
                <span>{offer.province || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{new Date(offer.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {offer.match_percentage !== undefined && (
                <div className="text-right">
                  <div className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">
                    Match
                  </div>
                  <div className="text-green-600 font-bold text-base">
                    {offer.match_percentage}%
                  </div>
                </div>
              )}
              <Link href={`/wishOffer/offer/${offer.id}`}>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 rounded-lg px-4 h-9 font-semibold text-sm"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
