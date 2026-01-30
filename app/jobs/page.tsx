"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  JobsHeader,
  EmployerDashboard,
  JobSeekerView,
  ApplyDialog,
} from "@/components/jobs";
import { getJobs, getMyJobs } from "@/services/jobs";
import { Job } from "@/types/types";
import { transformJobs } from "@/utils/jobTransform";

const Jobs: React.FC = () => {
  const router = useRouter();
  const [isHiringMode, setIsHiringMode] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMyJobs, setIsLoadingMyJobs] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const response = await getJobs(search);
      const transformedJobs = transformJobs(response.results);
      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    if (!isHiringMode) {
      fetchJobs(searchQuery);
    } else {
      fetchMyJobs();
    }
  }, [isHiringMode, searchQuery, fetchJobs, fetchMyJobs]);

  // Refresh data when page becomes visible (user returns from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (isHiringMode) {
          fetchMyJobs();
        } else {
          fetchJobs(searchQuery);
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isHiringMode, searchQuery, fetchJobs, fetchMyJobs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateJob = () => {
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
    // Refresh jobs to update is_applied status
    if (!isHiringMode) {
      fetchJobs(searchQuery);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <JobsHeader isHiringMode={isHiringMode} onModeChange={setIsHiringMode} />

      {isHiringMode ? (
        <EmployerDashboard
          onCreateJob={handleCreateJob}
          onEditJob={handleEditJob}
          jobs={myJobs}
          isLoading={isLoadingMyJobs}
        />
      ) : (
        <>
          <JobSeekerView
            jobs={jobs}
            onApply={handleApply}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </>
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

export default Jobs;
