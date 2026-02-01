"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export type FilterOptionProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  showChevron?: boolean;
};

export const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  isActive,
  onClick,
  icon,
  showChevron,
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
      isActive
        ? "bg-slate-100 text-slate-900"
        : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {showChevron && (
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    )}
  </button>
);
