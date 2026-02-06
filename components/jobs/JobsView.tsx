"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ApplyDialog } from "@/components/jobs";
import { Job } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { JobsSeekerContent } from "@/components/jobs/JobsSeekerContent";
import type { JobsViewMode } from "@/components/jobs/ModeToggle";
import { AuthDialog } from "@/components/auth/AuthDialog";

const JobsView: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "register">(
    "login",
  );
  const [pendingAction, setPendingAction] = useState<
    "create-job" | "apply-job" | null
  >(null);

  const handleApply = (job: Job) => {
    if (job.isApplied) {
      return; // Don't allow applying if already applied
    }
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token && !authLoading) {
      setSelectedJob(job);
      setPendingAction("apply-job");
      setAuthDialogMode("login");
      setAuthDialogOpen(true);
      return;
    }
    setSelectedJob(job);
    setApplyDialogOpen(true);
  };

  const handleApplySuccess = () => {
    // Jobs seeker view refetches on its own; no need to refresh here
  };

  const handleAuthenticated = () => {
    if (pendingAction === "apply-job" && selectedJob) {
      setApplyDialogOpen(true);
    }
    setPendingAction(null);
  };

  const handleModeChange = (mode: JobsViewMode) => {
    if (mode === "employer") {
      router.push("/jobs/employer");
    } else if (mode === "work-interests") {
      router.push("/jobs/work-interests");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="max-w-7xl px-4 sm:px-8 mx-auto min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <span className="text-slate-500">Loading...</span>
          </div>
        }
      >
        <JobsSeekerContent onApply={handleApply} onModeChange={handleModeChange} />
      </Suspense>

      {selectedJob && (
        <ApplyDialog
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          jobSlug={selectedJob.slug}
          jobTitle={selectedJob.title}
          onSuccess={handleApplySuccess}
        />
      )}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          if (!open) {
            setPendingAction(null);
          }
        }}
        initialMode={authDialogMode}
        returnTo={pendingAction === "create-job" ? "/jobs/create" : undefined}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};

export default JobsView;
