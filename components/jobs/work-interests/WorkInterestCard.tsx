"use client";

import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkInterest } from "@/services/workInterests";
import type { Location } from "@/types/auth";

function formatDate(value?: string) {
  if (!value) return "Recently added";
  try {
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

interface WorkInterestCardProps {
  interest: WorkInterest;
  onClick?: (interest: WorkInterest) => void;
  onHire?: (interest: WorkInterest) => void;
  showHireButton?: boolean;
}

export function WorkInterestCard({
  interest,
  onClick,
  onHire,
  showHireButton = true,
}: WorkInterestCardProps) {
  const unitGroupLabel = interest.unit_group
    ? `${interest.unit_group.code} · ${interest.unit_group.title}`
    : "Unit group not set";

  const locationsLabel =
    interest.preferred_locations && interest.preferred_locations.length > 0
      ? interest.preferred_locations
          .map((loc) => (loc as Location).name ?? String(loc))
          .join(", ")
      : "Any location";

  const handleClick = () => {
    if (onClick) onClick(interest);
  };

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    if (onHire) onHire(interest);
  };

  const interactive = !!onClick;

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={
        interactive ? (e) => e.key === "Enter" && handleClick() : undefined
      }
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-blue-600/30 hover:shadow-md transition-all group ${
        interactive ? "cursor-pointer" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="mt-1 text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {interest.title}
          </h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide line-clamp-1">
            {unitGroupLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge className="bg-blue-800 text-white text-[11px] px-2 py-1 rounded-full">
            {interest.proficiency_level}
          </Badge>
        </div>
      </div>

      {/* Person name (basic identity) */}
      {interest.name && (
        <p className="mb-1 text-xs font-medium text-slate-700 line-clamp-1">
          {interest.name}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[60vw] sm:max-w-xs">
            {locationsLabel}
          </span>
        </span>
        <span className="text-[11px] text-slate-400">
          Updated {formatDate(interest.updated_at || interest.created_at)}
        </span>
      </div>

      {/* Key skills preview (full list in dialog) */}
      {interest.skills?.length ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {interest.skills.map((skill) => (
            <Badge
              key={skill.id ?? skill.name}
              variant="outline"
              className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* Footer with availability and Hire Button */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-50 pt-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          {interest.availability}
        </span>
        {showHireButton && onHire && (
          <button
            type="button"
            onClick={handleHire}
            className="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-1 hover:text-blue-600"
          >
            Hire <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
