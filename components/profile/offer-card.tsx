"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";
import type { Offer } from "@/types/wish";

interface OfferCardProps {
  offer: Offer;
  onDelete: (id: number) => void;
  onEdit: (offer: Offer) => void;
  onConvert: (offer: Offer) => void;
  isDeleting: boolean;
  isConverting: boolean;
}

export function OfferCard({
  offer,
  onDelete,
  onEdit,
  onConvert,
  isDeleting,
  isConverting,
}: OfferCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-green-50 text-green-600 border-green-100 text-[10px] font-semibold uppercase">
              {offer.type}
            </Badge>
            {offer.match_percentage !== undefined && (
              <span className="text-[11px] text-gray-500">
                Match:{" "}
                <span className="font-semibold text-green-600">
                  {offer.match_percentage}%
                </span>
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {offer.title}
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
        {offer.description || "No description provided for this offer."}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-green-500" />
          {offer.province || "N/A"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(offer.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-1">
        <Link href={`/wishOffer/offer/${offer.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50"
          >
            View
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-gray-200 hover:bg-gray-50"
          onClick={() => onEdit(offer)}
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
          onClick={() => onConvert(offer)}
          disabled={isConverting || isDeleting}
        >
          {isConverting ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <ArrowRightLeft className="w-3 h-3 mr-1" />
          )}
          Convert
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(offer.id)}
          disabled={isDeleting || isConverting}
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3 mr-1" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
}
