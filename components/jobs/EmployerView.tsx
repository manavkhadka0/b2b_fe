"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyJobs } from "@/services/jobs";
import { Job } from "@/types/types";
import { transformJobs } from "@/utils/jobTransform";
import { useAuth } from "@/contexts/AuthContext";
import { EmployerContent } from "@/components/jobs/EmployerContent";
import { AuthDialog } from "@/components/auth/AuthDialog";

export default function EmployerView() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoadingMyJobs, setIsLoadingMyJobs] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "register">("login");
  const [pendingAction, setPendingAction] = useState<"create-job" | null>(null);

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
    fetchMyJobs();
  }, [fetchMyJobs]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMyJobs();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchMyJobs]);

  const handleCreateJob = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!user && !token && !authLoading) {
      setPendingAction("create-job");
      setAuthDialogMode("login");
      setAuthDialogOpen(true);
      return;
    }
    router.push("/jobs/create");
  };

  const handleEditJob = (job: Job) => {
    router.push(`/jobs/create?slug=${job.slug}`);
  };

  const handleModeChange = (isHiring: boolean) => {
    if (!isHiring) {
      router.push("/jobs");
    }
  };

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <span className="text-slate-500">Loading...</span>
          </div>
        }
      >
        <EmployerContent
          onCreateJob={handleCreateJob}
          onEditJob={handleEditJob}
          jobs={myJobs}
          isLoading={isLoadingMyJobs}
          isLoggedIn={
            !!user ||
            (typeof window !== "undefined" &&
              !!localStorage.getItem("accessToken"))
          }
          onModeChange={handleModeChange}
        />
      </Suspense>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          if (!open) setPendingAction(null);
        }}
        initialMode={authDialogMode}
        returnTo={pendingAction === "create-job" ? "/jobs/create" : undefined}
        onAuthenticated={() => {
          if (pendingAction === "create-job") {
            router.push("/jobs/create");
            setPendingAction(null);
          }
        }}
      />
    </>
  );
}
