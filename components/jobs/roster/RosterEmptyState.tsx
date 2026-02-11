"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface RosterEmptyStateProps {
  onCreateClick: () => void;
  isCreating?: boolean;
}

export function RosterEmptyState({
  onCreateClick,
  isCreating = false,
}: RosterEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 sm:p-12">
        <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <Building2 className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            No institute registered
          </h2>
          <p className="text-slate-600 text-sm max-w-md mb-6">
            Register your institute to manage the skilled workforce roster, track
            trainees, and view reports.
          </p>
          <Button
            onClick={onCreateClick}
            disabled={isCreating}
            className="bg-blue-800 text-white hover:bg-blue-900"
          >
            Create Institute
          </Button>
        </div>
      </div>
    </div>
  );
}
