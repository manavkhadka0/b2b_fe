"use client";

import React from "react";
import { X } from "lucide-react";

interface RosterFiltersSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function RosterFiltersSidebar({
  open,
  onClose,
}: RosterFiltersSidebarProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto py-4 px-4 transition-transform duration-200 ease-out lg:hidden"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-slate-900 text-sm">Filters</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-500 text-sm">Roster filters (coming soon)</p>
      </aside>
    </>
  );
}

