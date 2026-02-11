"use client";

import React from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { RosterCreateButton } from "./RosterCreateButton";
import type { Institute } from "@/types/institute";

interface RosterControlsProps {
  showControls: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onOpenFilters: () => void;
  institute: Institute | null;
}

export function RosterControls({
  showControls,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenFilters,
  institute,
}: RosterControlsProps) {
  if (!showControls) return null;

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      <div className="flex items-center gap-3 flex-1 min-w-0 justify-end sm:justify-between flex-wrap">
        <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white min-w-[200px] max-w-[280px] flex-1 sm:flex-initial order-2 sm:order-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-7 min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <RosterCreateButton
          isVerified={institute?.is_verified ?? false}
          variant="default"
          size="sm"
          className="order-1 sm:order-2 bg-blue-800 hover:bg-blue-900"
        />
      </div>
    </div>
  );
}

