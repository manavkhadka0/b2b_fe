"use client";

import React from "react";
import { MapPin, ChevronRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GraduateRoster } from "@/types/graduate-roster";

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

interface AvailableGraduateCardProps {
  graduate: GraduateRoster;
  onClick?: (graduate: GraduateRoster) => void;
  onHire?: (graduate: GraduateRoster) => void;
  showHireButton?: boolean;
}

export function AvailableGraduateCard({
  graduate,
  onClick,
  onHire,
  showHireButton = true,
}: AvailableGraduateCardProps) {
  const instituteName =
    typeof graduate.institute === "object" && graduate.institute
      ? graduate.institute.institute_name
      : graduate.institute_name;

  const locationLabel = (() => {
    const municipality =
      graduate.current_municipality || graduate.permanent_municipality;
    const district =
      graduate.current_district || graduate.permanent_district;
    if (municipality && district) {
      return `${municipality}, ${district}`;
    }
    return municipality || district || "Nepal";
  })();

  const skillsList = React.useMemo(() => {
    if (!graduate.specialization_key_skills) return [];
    return graduate.specialization_key_skills
      .split(/[,،]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [graduate.specialization_key_skills]);

  const handleClick = () => {
    if (onClick) onClick(graduate);
  };

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHire) onHire(graduate);
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
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-emerald-600/40 hover:shadow-md transition-all group flex flex-col justify-between ${
        interactive ? "cursor-pointer" : ""
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <GraduationCap className="w-3 h-3" />
                Graduate
              </span>
              {graduate.roster_type && (
                <span className="text-[11px] font-medium text-slate-400">
                  {graduate.roster_type}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
              {graduate.name}
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide line-clamp-1">
              {graduate.subject_trade_stream ||
                instituteName ||
                "Skilled Graduate"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {graduate.level_completed && (
              <Badge className="bg-indigo-700 text-white text-[11px] px-2.5 py-1 rounded-full">
                {graduate.level_completed}
              </Badge>
            )}
          </div>
        </div>

        {/* Institute Info if available */}
        {instituteName && (
          <p className="mb-2 text-xs font-medium text-slate-700 line-clamp-1">
            <span className="text-slate-400 font-normal">Institute:</span>{" "}
            {instituteName}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[60vw] sm:max-w-xs capitalize">
              {locationLabel}
            </span>
          </span>
          <span className="text-[11px] text-slate-400">
            Updated {formatDate(graduate.updated_at || graduate.created_at)}
          </span>
        </div>

        {/* Skills / Specialization preview */}
        {skillsList.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {skillsList.slice(0, 4).map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium"
              >
                {skill}
              </Badge>
            ))}
            {skillsList.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{skillsList.length - 4} more
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer with status and Hire Button */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          {graduate.job_status || "Available for Job"}
        </span>
        {showHireButton && onHire && (
          <button
            type="button"
            onClick={handleHire}
            className="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-1 hover:text-emerald-700"
          >
            Hire <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
