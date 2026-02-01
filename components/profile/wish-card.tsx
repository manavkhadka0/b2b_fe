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
import type { Wish } from "@/types/wish";

interface WishCardProps {
  wish: Wish;
  onDelete: (id: number) => void;
  onEdit: (wish: Wish) => void;
  onConvert: (wish: Wish) => void;
  isDeleting: boolean;
  isConverting: boolean;
}

export function WishCard({
  wish,
  onDelete,
  onEdit,
  onConvert,
  isDeleting,
  isConverting,
}: WishCardProps) {
  return (
    <div className="px-4 py-3 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-semibold uppercase">
              {wish.type}
            </Badge>
            {wish.match_percentage !== undefined && (
              <span className="text-[11px] text-gray-500">
                Match:{" "}
                <span className="font-semibold text-blue-600">
                  {wish.match_percentage}%
                </span>
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {wish.title}
          </h3>
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
        {wish.description || "No description provided for this wish."}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-gray-500 mt-1.5">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
          {wish.province || "N/A"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3 shrink-0" />
          {new Date(wish.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 mt-1.5">
        <Link href={`/wishOffer/wishes/${wish.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            View
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs text-gray-600 hover:bg-gray-100"
          onClick={() => onEdit(wish)}
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs text-amber-600 hover:bg-amber-50"
          onClick={() => onConvert(wish)}
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
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs text-red-600 hover:bg-red-50"
          onClick={() => onDelete(wish.id)}
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
