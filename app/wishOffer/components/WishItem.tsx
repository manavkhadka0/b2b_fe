"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wish } from "@/types/wish";

interface WishItemProps {
  wish: Wish;
}

export function WishItem({ wish }: WishItemProps) {
  return (
    <div className="p-4 md:p-5 hover:bg-blue-50/[0.02] transition-colors group">
      <div className="flex flex-col md:flex-row gap-4">
        {wish.image && (
          <div className="relative w-full md:w-48 h-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={wish.image}
              alt={wish.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-white/95 text-blue-600 border-none px-2 py-0.5 text-[10px] font-semibold uppercase">
                {wish.type}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <Link
              href={`/wishOffer/wishes/${wish.id}`}
              className="flex-1 min-w-0"
            >
              {!wish.image && (
                <Badge className="mb-1.5 bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {wish.type}
                </Badge>
              )}
              <h3 className="font-semibold text-base md:text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {wish.title}
              </h3>
            </Link>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {wish.description || "No description provided for this wish."}
          </p>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span>{wish.province || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{new Date(wish.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">
                  Match
                </div>
                <div className="text-blue-600 font-bold text-base">
                  {wish.match_percentage}%
                </div>
              </div>
              <Link href={`/wishOffer/wishes/${wish.id}`}>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 h-9 font-semibold text-sm"
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
