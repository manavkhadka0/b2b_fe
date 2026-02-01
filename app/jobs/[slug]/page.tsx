"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Banknote,
  Building2,
  Briefcase,
  GraduationCap,
  Calendar,
  Eye,
  Users,
  Layers,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getJobBySlug } from "@/services/jobs";
import { ApplyDialog, JobsHeader } from "@/components/jobs";

interface JobDetailResponse {
  id: number;
  slug: string;
  title: string;
  company_name: string | null;
  company?: { id: number; name: string } | null;
  location: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
  }>;
  unit_group: {
    id: number;
    code: string;
    title: string;
    slug: string;
    description?: string;
    minor_group?: {
      code: string;
      title: string;
      sub_major_group?: {
        code?: string;
        title?: string;
        major_group?: { code: string; title: string };
      };
    };
  };
  required_skill_level: string;
  required_education: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  show_salary: boolean;
  salary_range_min?: string;
  salary_range_max?: string;
  posted_date: string;
  deadline: string;
  employment_type: string;
  applications_count?: number;
  views_count?: number;
  has_already_applied?: boolean;
  status?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPostedDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJobBySlug(slug);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) setError("Job not found");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchJob();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const companyName =
    job?.company_name ||
    (job?.company?.name ? job.company.name : null) ||
    "Company";

  const locationStr =
    job?.location && job.location.length > 0
      ? job.location.map((loc) => loc.name).join(", ")
      : "Not specified";

  const salaryStr =
    job?.show_salary && job?.salary_range_min && job?.salary_range_max
      ? `NRs. ${parseFloat(
          job.salary_range_min
        ).toLocaleString()} - ${parseFloat(
          job.salary_range_max
        ).toLocaleString()}`
      : null;

  const categoryPath = job?.unit_group?.minor_group?.sub_major_group
    ?.major_group
    ? [
        job.unit_group.minor_group.sub_major_group.major_group.title,
        job.unit_group.minor_group.sub_major_group?.title,
        job.unit_group.minor_group?.title,
        job.unit_group.title,
      ].filter(Boolean)
    : job?.unit_group?.title
    ? [job.unit_group.title]
    : [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10 min-h-screen">
        <JobsHeader
          isHiringMode={false}
          onModeChange={() => router.push("/jobs")}
        />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10 min-h-screen">
        <JobsHeader
          isHiringMode={false}
          onModeChange={() => router.push("/jobs")}
        />
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600 mb-4">{error || "Job not found"}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/jobs")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 min-h-screen">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>

      <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{companyName}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold uppercase tracking-wide">
                {job.employment_type}
              </span>
              {job.has_already_applied && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Already Applied
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {locationStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Posted {formatPostedDate(job.posted_date)}
            </span>
            {salaryStr && (
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-slate-400" />
                {salaryStr}
              </span>
            )}
            {job.applications_count != null && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                {job.applications_count} application
                {job.applications_count !== 1 ? "s" : ""}
              </span>
            )}
            {job.views_count != null && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-400" />
                {job.views_count} view{job.views_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!job.has_already_applied && (
            <div className="mt-6">
              <Button
                onClick={() => setApplyDialogOpen(true)}
                className="gap-2"
              >
                Apply Now
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <Briefcase className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Employment Type
                </p>
                <p className="text-slate-900 font-medium mt-0.5">
                  {job.employment_type}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <GraduationCap className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Required Education
                </p>
                <p className="text-slate-900 font-medium mt-0.5">
                  {job.required_education}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <Layers className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Skill Level
                </p>
                <p className="text-slate-900 font-medium mt-0.5">
                  {job.required_skill_level}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <Calendar className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Application Deadline
                </p>
                <p className="text-slate-900 font-medium mt-0.5">
                  {formatDate(job.deadline)}
                </p>
              </div>
            </div>
          </div>

          {/* Category */}
          {categoryPath.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                Job Category
              </h2>
              <p className="text-slate-600">{categoryPath.join(" › ")}</p>
            </section>
          )}

          {/* Description */}
          {job.description && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Description
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed prose-headings:text-slate-900 prose-ul:text-slate-700"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Responsibilities
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.responsibilities }}
              />
            </section>
          )}

          {/* Requirements */}
          {job.requirements && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Requirements
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </section>
          )}
        </div>
      </article>

      <ApplyDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        jobSlug={job.slug}
        jobTitle={job.title}
        onSuccess={() => {
          setJob((prev) =>
            prev ? { ...prev, has_already_applied: true } : prev
          );
        }}
      />
    </div>
  );
}
