"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import type { GraduateRoster } from "@/types/graduate-roster";
import type { Institute } from "@/types/institute";
import { Button } from "@/components/ui/button";

interface PaginationState {
  count: number;
  next: string | null;
  previous: string | null;
}

interface RosterCardsProps {
  graduates: GraduateRoster[];
  graduatesLoading: boolean;
  pagination: PaginationState;
  page: number;
  onPageChange: (page: number) => void;
  hasSearch: boolean;
  institute: Institute | null;
  onSelectGraduate: (graduate: GraduateRoster) => void;
}

export function RosterCards({
  graduates,
  graduatesLoading,
  pagination,
  page,
  onPageChange,
  hasSearch,
  institute,
  onSelectGraduate,
}: RosterCardsProps) {
  if (graduatesLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="text-slate-400 text-sm">Loading roster...</span>
      </div>
    );
  }

  if (graduates.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        {hasSearch
          ? "No graduates match your search."
          : "No graduates in roster yet. Add your first graduate to get started."}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {graduates.map((g) => {
          const instituteName =
            typeof g.institute === "object" && g.institute
              ? g.institute.institute_name
              : institute?.institute_name;
          const locationMunicipality =
            g.current_municipality || g.permanent_municipality;
          const locationDistrict = g.current_district || g.permanent_district;
          const availableFromLabel = g.available_from
            ? new Date(g.available_from).toLocaleDateString()
            : "Not specified";
          const skillsPreview =
            g.specialization_key_skills ||
            g.subject_trade_stream ||
            "No skills specified";

          return (
            <div
              key={g.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectGraduate(g)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSelectGraduate(g);
                }
              }}
              className="w-full h-full rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-600/40 hover:bg-slate-50/60 transition-colors cursor-pointer flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                    {g.name}
                  </h3>
                  {instituteName && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                      {instituteName}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {g.subject_trade_stream || "No specialization specified"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
                    g.job_status === "Available for Job"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                  }`}
                >
                  {g.job_status}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-normal break-words">
                    {locationMunicipality || "Location not set"},{" "}
                    {locationDistrict || "—"}
                  </span>
                </span>
                {g.level_completed && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{g.level_completed}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Available from {availableFromLabel}</span>
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500 line-clamp-2">
                  {skillsPreview}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {(pagination.next || pagination.previous) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            {pagination.count > 0 && (
              <span>
                Page {page}
                {pagination.count > 0 && (
                  <span>
                    {" "}
                    · {pagination.count} total graduate
                    {pagination.count !== 1 ? "s" : ""}
                  </span>
                )}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={!pagination.previous || graduatesLoading}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={!pagination.next || graduatesLoading}
              className="gap-1.5"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

