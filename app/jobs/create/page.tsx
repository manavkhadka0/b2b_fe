"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PostJobForm } from "@/components/jobs/PostJobForm";
import { getUnitGroups } from "@/services/jobs";
import { UnitGroup } from "@/types/unit-groups";
import { useSearchParams } from "next/navigation";
import { getJobBySlug } from "@/services/jobs";
import { Job } from "@/types/job";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);
  const [jobData, setJobData] = useState<Job | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const hasFetchedUnitGroups = useRef(false);

  // If not authenticated (no user and no token), show auth dialog instead of redirecting away
  useEffect(() => {
    if (authLoading) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token) {
      setAuthDialogOpen(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Don't fetch until we know user is authenticated
    if (authLoading || (!user && typeof window !== "undefined" && !localStorage.getItem("accessToken"))) return;

    const needsUnitGroups = !hasFetchedUnitGroups.current;
    const needsJob = !!slug;
    if (!needsUnitGroups && !needsJob) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (needsUnitGroups) {
          hasFetchedUnitGroups.current = true;
          const unitGroupsData = await getUnitGroups();
          setUnitGroups(unitGroupsData);
        }

        if (needsJob) {
          try {
            const job = await getJobBySlug(slug);
            setJobData(job);
          } catch (error) {
            console.error("Failed to fetch job:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, authLoading, user]);

  // Show loading while checking auth or when unauthenticated
  if (
    authLoading ||
    (!user &&
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken"))
  ) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/jobs");
  };

  return (
    <>
      <PostJobForm
        unitGroups={unitGroups}
        initialData={jobData}
        isEditing={!!slug}
        onSuccess={handleSuccess}
      />
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
        returnTo={`/jobs/create${slug ? `?slug=${slug}` : ""}`}
      />
    </>
  );
}
