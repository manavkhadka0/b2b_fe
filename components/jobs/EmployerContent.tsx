"use client";

import React, { useState } from "react";
import { Job } from "@/types/types";
import { Loader2, X, Menu } from "lucide-react";
import { EmployerDashboard } from "@/components/jobs/EmployerDashboard";
import { JobsSidebarNav } from "@/components/jobs/JobsSidebarNav";
import { JOBS_SIDEBAR } from "@/components/jobs/jobs-sidebar-styles";
import type { JobsViewMode } from "@/components/jobs/ModeToggle";

interface EmployerContentProps {
  onCreateJob: () => void;
  onEditJob: (job: Job) => void;
  jobs: Job[];
  isLoading: boolean;
  isLoggedIn: boolean;
  onModeChange?: (mode: JobsViewMode) => void;
}

export function EmployerContent({
  onCreateJob,
  onEditJob,
  jobs,
  isLoading,
  isLoggedIn,
  onModeChange,
}: EmployerContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="max-w-7xl px-8 mx-auto py-10 min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${JOBS_SIDEBAR.mobile} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ msOverflowStyle: "none" } as React.CSSProperties}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-slate-900 text-sm">Filters</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {onModeChange && (
          <JobsSidebarNav mode="employer" onModeChange={onModeChange} />
        )}
      </aside>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {onModeChange && (
          <aside className={JOBS_SIDEBAR.desktop}>
            <JobsSidebarNav mode="employer" onModeChange={onModeChange} />
          </aside>
        )}
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden mb-4"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-2 py-2">
                Employer Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
                Manage your job postings and find the best talent for your team.
              </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-white">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <EmployerDashboard
              onCreateJob={onCreateJob}
              onEditJob={onEditJob}
              jobs={jobs}
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
    </div>
  );
}
