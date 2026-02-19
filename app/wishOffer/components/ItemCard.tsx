"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  ChevronRight,
  Phone,
  Mail,
  Package,
  Briefcase,
} from "lucide-react";
import type { Wish, Offer, ItemWithSource } from "@/types/wish";

// Derive wish vs offer from model_type (combined API) or _source (search/tagged)
function getIsWish(item: ItemWithSource | Wish | Offer): boolean {
  const src = item as ItemWithSource;
  return src.model_type === "wish" || src._source === "wish";
}

function formatTimeAgo(createdAt: string): string {
  const created = new Date(createdAt);
  const diffMs = Date.now() - created.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return diffMin === 1 ? "1 min ago" : `${diffMin} min ago`;
  if (diffHr < 24) return diffHr === 1 ? "1 hr ago" : `${diffHr} hr ago`;
  if (diffDay < 7) return diffDay === 1 ? "Yesterday" : `${diffDay} days ago`;
  return created.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      created.getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
}

export type ItemCardProps = {
  item: Wish | Offer | ItemWithSource;
  isWish?: boolean; // Optional: derived from model_type/_source when not provided
  onOpen: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isWish: isWishProp,
  onOpen,
  onCreateOffer,
  onCreateWish,
}) => {
  const isWish = isWishProp ?? getIsWish(item as ItemWithSource);
  const imageUrl =
    item.image ||
    (item as any).product?.image ||
    (item as any).service?.image ||
    null;
  const postedBy = item.company_name || item.full_name || "Unknown";
  const location = item.province || item.municipality || item.country || "N/A";
  const timeAgo = formatTimeAgo(item.created_at);
  const avatarLetter = (postedBy || "?").charAt(0).toUpperCase();
  const words = postedBy.trim().split(/\s+/).filter(Boolean);
  const postedByDisplay = words.length > 1 ? `${words[0]}...` : postedBy;
  const contactNumber = item.mobile_no || item.alternate_no || "";
  const contactEmail = item.email || "";

  return (
    <div
      className="flex flex-col rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm group cursor-pointer transition-colors h-full overflow-hidden"
      onClick={onOpen}
    >
      <div className="w-full aspect-[16/9] flex-shrink-0 overflow-hidden bg-slate-50 relative">
        <Image
          src={imageUrl || "/no-image.png"}
          alt={item.title}
          fill
          className={imageUrl ? "" : "object-contain p-12 bg-white h-5"}
        />
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm"
            aria-hidden
          >
            {isWish ? "Wish" : "Offer"}
          </span>
          {item.type && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100/95 text-slate-600 shadow-sm backdrop-blur-sm flex items-center gap-1"
              aria-hidden
            >
              {item.type === "Product" ? (
                <Package className="w-3 h-3" />
              ) : (
                <Briefcase className="w-3 h-3" />
              )}
              {item.type}
            </span>
          )}
          {typeof (item as any).match_percentage === "number" &&
            (item as any).match_percentage > 0 && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-100/95 text-blue-700 shadow-sm backdrop-blur-sm"
                aria-hidden
              >
                {(item as any).match_percentage}% match
              </span>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        {(item.description ?? "").trim() && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        {!(item.description ?? "").trim() &&
          ((item as any).product?.description ||
            (item as any).service?.name) && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {(item as any).product?.description ||
                (item as any).service?.name}
            </p>
          )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
          <span className="flex items-center gap-1 min-w-0" title={location}>
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate capitalize">{location}</span>
          </span>
          <span>{timeAgo}</span>
        </div>

        {(contactNumber || contactEmail) && (
          <div className="flex flex-col gap-0.5 text-xs text-slate-500">
            {contactNumber && (
              <a
                href={`tel:${contactNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{contactNumber}</span>
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{contactEmail}</span>
              </a>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center flex-shrink-0"
              aria-hidden
            >
              {avatarLetter}
            </span>
            <span
              className="text-xs text-slate-600 min-w-0 capitalize"
              title={postedBy}
            >
              {postedByDisplay}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isWish && onCreateOffer) onCreateOffer();
              else if (!isWish && onCreateWish) onCreateWish();
            }}
            className="text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1 shrink-0"
          >
            {isWish ? "Create Offer" : "Create Wish"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
