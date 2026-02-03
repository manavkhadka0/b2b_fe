"use client";

import React from "react";
import { Job } from "@/types/types";
import { Loader2 } from "lucide-react";
import { EmployerDashboard } from "@/components/jobs/EmployerDashboard";
import { ModeToggle } from "@/components/jobs/ModeToggle";

interface EmployerContentProps {
  onCreateJob: () => void;
  onEditJob: (job: Job) => void;
  jobs: Job[];
  isLoading: boolean;
  isLoggedIn: boolean;
  onModeChange?: (isHiring: boolean) => void;
}

export function EmployerContent({
  onCreateJob,
  onEditJob,
  jobs,
  isLoading,
  isLoggedIn,
  onModeChange,
}: EmployerContentProps) {
  return (
    <div className="max-w-7xl mx-auto py-10 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-2 py-2">
                Employer Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
                Manage your job postings and find the best talent for your team.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onModeChange && (
                <ModeToggle isHiringMode={true} onModeChange={onModeChange} />
              )}
            </div>
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
