import React from "react";

export type JobsViewMode = "jobs" | "work-interests" | "employer";

interface ModeToggleProps {
  mode: JobsViewMode;
  onModeChange: (mode: JobsViewMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  const isJobs = mode === "jobs";
  const isWorkInterests = mode === "work-interests";

  const baseClasses =
    "flex-1 text-center px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-medium transition-all";

  return (
    <div className="flex flex-wrap items-stretch gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
      <button
        type="button"
        onClick={() => onModeChange("jobs")}
        className={`${baseClasses} ${
          isJobs
            ? "bg-blue-800 text-white shadow hover:bg-blue-900"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        Find a Job
      </button>
      <button
        type="button"
        onClick={() => onModeChange("work-interests")}
        className={`${baseClasses} ${
          isWorkInterests
            ? "bg-blue-800 text-white shadow hover:bg-blue-900"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        Work Interests
      </button>
    </div>
  );
};
