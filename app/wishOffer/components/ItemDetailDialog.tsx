"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Globe,
  Package,
  Phone,
  Mail,
} from "lucide-react";
import type { ItemWithSource } from "@/types/wish";

export type ItemDetailDialogProps = {
  item: ItemWithSource;
  onClose: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
};

export const ItemDetailDialog: React.FC<ItemDetailDialogProps> = ({
  item,
  onClose,
  onCreateOffer,
  onCreateWish,
}) => {
  const isWish = item._source === "wish";
  const imageUrl = item.image || (isWish ? item.product?.image : null) || null;
  const postedBy = item.company_name || item.full_name || "Unknown";
  const locationParts = [
    item.address,
    item.ward,
    item.municipality,
    item.province,
    item.country,
  ].filter(Boolean);
  const locationStr = locationParts.length ? locationParts.join(", ") : "N/A";
  const category =
    item.product?.category?.name ??
    (item.service && "category" in item.service
      ? item.service.category?.name
      : null);
  const created = new Date(item.created_at);
  const createdStr = created.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasPhone = Boolean(item.mobile_no);
  const hasEmail = Boolean(item.email);
  const hasWebsite = Boolean(item.company_website);

  const formatWebsiteUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    if (isWish && onCreateOffer) onCreateOffer();
    else if (!isWish && onCreateWish) onCreateWish();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image fixed at top, not scrollable; X overlaid on image */}
        <div className="relative w-full aspect-[16/9] bg-slate-100 shrink-0">
          <Image
            src={imageUrl || "/no-image.png"}
            alt={item.title}
            fill
            className={
              imageUrl ? "object-cover" : "object-contain p-24 bg-white"
            }
          />
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-white/95 text-slate-700 shadow-sm">
            {isWish ? "Wish" : "Offer"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/95 text-slate-600 hover:bg-white hover:text-slate-800 shadow-sm transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable content below image */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-4 sm:p-5 space-y-5">
            <div>
              <h2
                id="item-detail-title"
                className="text-lg font-bold text-slate-900 leading-snug"
              >
                {item.title}
              </h2>
              {category && (
                <p className="text-sm text-slate-500 mt-0.5">{category}</p>
              )}
            </div>

            {(item.description ?? "").trim() && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Posted by
                </h3>
                <p className="text-sm text-slate-800 font-medium capitalize">
                  {postedBy}
                </p>
                {item.designation && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.designation}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Posted on
                </h3>
                <p className="text-sm text-slate-700">{createdStr}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </h3>
              <p className="text-sm text-slate-700">{locationStr}</p>
            </div>

            {(hasPhone || hasEmail || hasWebsite) && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Contact
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {hasPhone && (
                    <li className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${item.mobile_no}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.mobile_no}
                      </a>
                    </li>
                  )}
                  {hasEmail && (
                    <li className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-blue-600 transition-colors break-all"
                      >
                        {item.email}
                      </a>
                    </li>
                  )}
                  {hasWebsite && (
                    <li className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={formatWebsiteUrl(item.company_website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block min-w-0"
                      >
                        {item.company_website}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {(item.product || item.service) && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  {item.product ? "Product" : "Service"}
                </h3>
                <p className="text-sm text-slate-700 font-medium">
                  {item.product?.name ?? item.service?.name ?? "—"}
                </p>
                {(item.product?.description ?? item.service?.description) && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.product?.description ?? item.service?.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {(isWish && onCreateOffer) || (!isWish && onCreateWish) ? (
            <button
              type="button"
              onClick={handleAction}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              {isWish ? "Create Offer" : "Request"}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
