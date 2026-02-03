"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { JobsHeader, EmployerDashboard, ApplyDialog } from "@/components/jobs";
import { getMyJobs } from "@/services/jobs";
import { Job } from "@/types/types";
import { transformJobs } from "@/utils/jobTransform";
import { useAuth } from "@/contexts/AuthContext";
import { JobsSeekerContent } from "./JobsSeekerContent";

const JobsView: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading, requireAuth } = useAuth();
  const [isHiringMode, setIsHiringMode] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoadingMyJobs, setIsLoadingMyJobs] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchMyJobs = useCallback(async () => {
    setIsLoadingMyJobs(true);
    try {
      const response = await getMyJobs();
      const transformedJobs = transformJobs(response.results);
      setMyJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
    } finally {
      setIsLoadingMyJobs(false);
    }
  }, []);

  useEffect(() => {
    if (isHiringMode) {
      fetchMyJobs();
    }
  }, [isHiringMode, fetchMyJobs]);

  // Refresh data when page becomes visible (user returns from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isHiringMode) {
        fetchMyJobs();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isHiringMode, fetchMyJobs]);

  const handleCreateJob = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token && !authLoading) {
      requireAuth("/jobs/create");
      return;
    }
    router.push("/jobs/create");
  };

  const handleEditJob = (job: Job) => {
    router.push(`/jobs/create?slug=${job.slug}`);
  };

  const handleApply = (job: Job) => {
    if (job.isApplied) {
      return; // Don't allow applying if already applied
    }
    setSelectedJob(job);
    setApplyDialogOpen(true);
  };

  const handleApplySuccess = () => {
    // Jobs seeker view refetches on its own; no need to refresh here
  };

  return (
    <div className="max-w-7xl mx-auto px-8 min-h-screen">
      {isHiringMode ? (
        <>
          <JobsHeader
            isHiringMode={isHiringMode}
            onModeChange={setIsHiringMode}
          />
          <EmployerDashboard
            onCreateJob={handleCreateJob}
            onEditJob={handleEditJob}
            jobs={myJobs}
            isLoading={isLoadingMyJobs}
            isLoggedIn={
              !!user ||
              (typeof window !== "undefined" &&
                !!localStorage.getItem("accessToken"))
            }
          />
        </>
      ) : (
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <span className="text-slate-500">Loading...</span>
            </div>
          }
        >
          <JobsSeekerContent
            onApply={handleApply}
            onModeChange={setIsHiringMode}
          />
        </Suspense>
      )}

      {selectedJob && (
        <ApplyDialog
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          jobSlug={selectedJob.slug}
          jobTitle={selectedJob.title}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default JobsView;
