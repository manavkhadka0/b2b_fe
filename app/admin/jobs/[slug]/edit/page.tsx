"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getJobBySlug } from "@/services/jobs";
import { PostJobForm } from "@/components/jobs/PostJobForm";

export default function AdminEditJobPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [job, setJob] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobBySlug(params.slug);
        setJob(data);
      } catch (err) {
        console.error("Failed to load job:", err);
        setError("Failed to load job. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isChecking) {
      fetchJob();
    }
  }, [isAuthenticated, isChecking, params.slug]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Edit job</h2>
        <p className="text-sm text-rose-600">{error ?? "Job not found."}</p>
      </div>
    );
  }

  return (
    <PostJobForm
      initialData={job as Parameters<typeof PostJobForm>[0]["initialData"]}
      isEditing
      onSuccess={() => router.push("/admin/jobs")}
    />
  );
}
