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

export default function CreateJobPage() {
  const router = useRouter();
  const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobData, setJobData] = useState<Job | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  useEffect(() => {
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
  }, [slug]);

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
