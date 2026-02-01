"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostJobForm } from "@/components/jobs/PostJobForm";
import { getUnitGroups, getLocations } from "@/services/jobs";
import { UnitGroup } from "@/types/unit-groups";
import { Location } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { getJobBySlug } from "@/services/jobs";
import { Job } from "@/types/job";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobData, setJobData] = useState<Job | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  // Redirect to login if not authenticated (no user and no token)
  useEffect(() => {
    if (authLoading) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!user && !token) {
      const returnTo = encodeURIComponent("/jobs/create" + (slug ? `?slug=${slug}` : ""));
      router.replace(`/login?returnTo=${returnTo}`);
    }
  }, [user, authLoading, router, slug]);

  useEffect(() => {
    // Don't fetch until we know user is authenticated
    if (authLoading || (!user && typeof window !== "undefined" && !localStorage.getItem("accessToken"))) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [unitGroupsData, locationsData] = await Promise.all([
          getUnitGroups(),
          getLocations(),
        ]);

        setUnitGroups(unitGroupsData);
        setLocations(locationsData);

        // If editing, fetch job data
        if (slug) {
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

  // Show loading while checking auth or when redirecting to login
  if (authLoading || (!user && typeof window !== "undefined" && !localStorage.getItem("accessToken"))) {
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
    <PostJobForm
      unitGroups={unitGroups}
      locations={locations}
      initialData={jobData}
      isEditing={!!slug}
      onSuccess={handleSuccess}
    />
  );
}
