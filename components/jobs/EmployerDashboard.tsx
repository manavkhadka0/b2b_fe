import React from "react";
import { PlusCircle } from "lucide-react";
import { Job } from "@/types/types";
import { JobCard } from "./JobCard";
import { ModeToggle } from "@/components/jobs/ModeToggle";

interface EmployerDashboardProps {
  onCreateJob: () => void;
  onEditJob: (job: Job) => void;
  jobs: Job[];
  isLoading: boolean;
  isLoggedIn?: boolean;
  onModeChange?: (isHiring: boolean) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  onCreateJob,
  onEditJob,
  jobs,
  isLoading,
  isLoggedIn = false,
  onModeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Create Job Button */}
      <div className="flex items-center gap-3 mb-2 flex-wrap justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {onModeChange && (
            <ModeToggle isHiringMode={true} onModeChange={onModeChange} />
          )}
        </div>
        <button
          onClick={onCreateJob}
          className="w-full sm:w-auto px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="whitespace-nowrap">Create Job Posting</span>
        </button>
      </div>

      {/* My Jobs List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          My Job Postings
        </h2>
        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">Loading your jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">
              {isLoggedIn
                ? "You haven't posted any jobs yet. Create your first job posting above!"
                : "Log in to create and manage your job postings."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showApplyButton={false}
                showEditButton={true}
                onEdit={onEditJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
