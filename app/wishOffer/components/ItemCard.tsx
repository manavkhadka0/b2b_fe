"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Package,
  Briefcase,
} from "lucide-react";
import type { Wish, Offer, ItemWithSource } from "@/types/wish";
import { RichTextContent } from "@/components/ui/rich-text-content";

function getIsWish(item: ItemWithSource | Wish | Offer): boolean {
  const src = item as ItemWithSource;
  return src.model_type === "wish" || src._source === "wish";
}

function getAvatarInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return (name || "?").charAt(0).toUpperCase();
}

function getCardAccentVariant(index: number): "rust" | "gold" | "sage" {
  const variants: Array<"rust" | "gold" | "sage"> = ["rust", "gold", "sage"];
  return variants[index % 3];
}

const ACCENT_COLORS = {
  rust: "var(--accent-rust)",
  gold: "var(--accent-gold)",
  sage: "var(--accent-sage)",
};

export type ItemCardProps = {
  item: Wish | Offer | ItemWithSource;
  isWish?: boolean;
  onOpen: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
  /** Optional index for accent variant cycling */
  index?: number;
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isWish: isWishProp,
  onOpen,
  onCreateOffer,
  onCreateWish,
  index = 0,
}) => {
  const isWish = isWishProp ?? getIsWish(item as ItemWithSource);
  const imageUrl =
    item.image ||
    (item as any).product?.image ||
    (item as any).service?.image ||
    null;
  const fullName = item.full_name || item.company_name || "Unknown";
  const designation = item.designation || "";
  const location =
    [item.municipality, item.province].filter(Boolean).join(", ") ||
    item.country ||
    item.address ||
    null;
  const phone = item.mobile_no || (item as any).alternate_no || null;
  const email = item.email || null;
  const avatarInitials = getAvatarInitials(fullName);
  const matchPct =
    typeof (item as any).match_percentage === "number"
      ? (item as any).match_percentage
      : null;

  const typeIcon =
    item.type === "Product" ? (
      <Package className="w-3 h-3" />
    ) : item.type === "Service" ? (
      <Briefcase className="w-3 h-3" />
    ) : null;

  const description =
    (item.description ?? "").trim() ||
    (item as any).product?.description ||
    (item as any).service?.name ||
    "";

  const accentVariant = getCardAccentVariant(index);
  const accentColor = ACCENT_COLORS[accentVariant];

  // Match ring: circumference ≈ 2 * π * 18 ≈ 113
  const circumference = 2 * Math.PI * 18;
  const matchOffset =
    matchPct != null ? circumference * (1 - matchPct / 100) : circumference;

  const hasCta = (isWish && onCreateOffer) || (!isWish && onCreateWish);

  return (
    <div
      className="group flex flex-col rounded-[20px] overflow-hidden border border-[var(--border-subtle)] bg-white transition-shadow duration-300 ease-out cursor-pointer h-full relative hover:shadow-lg"
      style={{ "--card-accent": accentColor } as React.CSSProperties}
      onClick={onOpen}
    >
      {/* Image area */}
      <div className="h-[160px] bg-white flex items-center justify-center overflow-hidden relative shrink-0">
        {/* Badge row */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-20">
          <span className="text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-[rgba(26,23,20,0.75)] text-white backdrop-blur-sm">
            {isWish ? "Wish" : "Offer"}
            {typeIcon && item.type && (
              <>
                <span className="opacity-70 mx-0.5">·</span>
                {item.type}
              </>
            )}
          </span>
        </div>

        {/* Match ring */}
        {matchPct != null && (
          <div className="absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center z-20 rounded-full bg-white/95 shadow-sm">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="rgba(26,23,20,0.08)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={matchOffset}
                className="transition-[stroke-dashoffset] duration-700 ease-out"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[var(--ink)] tracking-tight"
              style={
                matchPct === 100 ? { color: accentColor, fontSize: "7px" } : {}
              }
            >
              {matchPct}%
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center z-0 bg-gray-50">
          <img
            src={imageUrl || "/no-image.png"}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-contain ${!imageUrl ? "p-10" : ""}`}
          />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-4 min-w-0">
        <h3 className="text-base font-semibold text-[var(--ink)] leading-tight mb-1.5 line-clamp-2">
          {item.title}
        </h3>
        <RichTextContent
          content={description}
          className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 flex-1"
          lineClamp={2}
          plainText
        />

        {/* Info list */}
        <div className="flex flex-col gap-1.5 mb-3 mt-3">
          {location && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#5A5550]">
              <div className="w-[26px] h-[26px] rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <MapPin
                  className="w-3 h-3 text-[var(--muted)]"
                  strokeWidth={1.8}
                />
              </div>
              <span className="truncate">{location}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#5A5550]">
              <div className="w-[26px] h-[26px] rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <Phone
                  className="w-3 h-3 text-[var(--muted)]"
                  strokeWidth={1.8}
                />
              </div>
              <span className="truncate">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#5A5550]">
              <div className="w-[26px] h-[26px] rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <Mail
                  className="w-3 h-3 text-[var(--muted)]"
                  strokeWidth={1.8}
                />
              </div>
              <span className="truncate">{email}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: accentColor }}
            >
              {avatarInitials}
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[var(--ink)] leading-tight truncate">
                {fullName}
              </div>
              {designation && (
                <div className="text-[10.5px] text-[var(--muted)] truncate">
                  {designation}
                </div>
              )}
            </div>
          </div>

          {hasCta && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isWish && onCreateOffer) onCreateOffer();
                else if (!isWish && onCreateWish) onCreateWish();
              }}
              className="flex items-center gap-0.5 text-[11px] font-semibold border border-[var(--card-accent)] text-[var(--card-accent)] py-1 px-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out whitespace-nowrap shrink-0 hover:bg-[var(--card-accent)] hover:text-white hover:border-[var(--card-accent)]"
            >
              {isWish ? "Create Offer" : "Create Wish"}
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
