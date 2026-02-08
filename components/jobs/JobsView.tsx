"use client";

import React, { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApplyDialog } from "@/components/jobs";
import { Job } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { JobsSeekerContent } from "@/components/jobs/JobsSeekerContent";
import type { JobsViewMode } from "@/components/jobs/ModeToggle";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { hasJobseekerProfile } from "@/services/jobseeker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [createCvDialogOpen, setCreateCvDialogOpen] = useState(false);
  const [cvCheckLoading, setCvCheckLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const checkCvAndOpenApply = useCallback(async () => {
    if (!user?.username) return;
    setCvCheckLoading(true);
    try {
      const has = await hasJobseekerProfile();
      if (has) {
        setApplyDialogOpen(true);
      } else {
        setCreateCvDialogOpen(true);
      }
    } catch (err) {
      console.error("Error checking CV profile:", err);
      setCreateCvDialogOpen(true);
    } finally {
      setCvCheckLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (!user?.username) {
      setHasProfile(null);
      return;
    }
    let cancelled = false;
    hasJobseekerProfile()
      .then((has) => {
        if (!cancelled) setHasProfile(has);
      })
      .catch(() => {
        if (!cancelled) setHasProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.username]);

  useEffect(() => {
    if (
      user?.username &&
      pendingAction === "apply-job" &&
      selectedJob &&
      !cvCheckLoading
    ) {
      checkCvAndOpenApply();
      setPendingAction(null);
    }
  }, [
    user?.username,
    pendingAction,
    selectedJob,
    cvCheckLoading,
    checkCvAndOpenApply,
  ]);

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
    checkCvAndOpenApply();
  };

  const handleApplySuccess = () => {
    // Jobs seeker view refetches on its own; no need to refresh here
  };

  const handleAuthenticated = () => {
    // After login, useEffect will run when user is set and run checkCvAndOpenApply
    // Don't clear pendingAction here so the effect can run
  };

  const goToProfile = () => {
    setCreateCvDialogOpen(false);
    setSelectedJob(null);
    router.push("/profile");
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
      {hasProfile === false && user && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <p className="text-amber-800 text-sm">
            Create your CV in your profile to apply for jobs.
          </p>
          <Button variant="outline" size="sm" onClick={goToProfile}>
            Create CV
          </Button>
        </div>
      )}
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

      <Dialog open={createCvDialogOpen} onOpenChange={setCreateCvDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CV required</DialogTitle>
            <DialogDescription>
              You need a CV to apply for jobs. Create one in your profile to
              continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={goToProfile}>Go to profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsView;
