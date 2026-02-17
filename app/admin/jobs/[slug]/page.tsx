"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getJobBySlug } from "@/services/jobs";
import { format } from "date-fns";
import type { JobApiResponse } from "@/types/types";

function formatLocation(
  location: string | Array<{ name?: string } | string> | null | undefined,
): string {
  if (!location) return "—";
  if (typeof location === "string") return location;
  if (Array.isArray(location)) {
    return location
      .map((l) =>
        typeof l === "object" && l?.name ? l.name : String(l),
      )
      .join(", ");
  }
  return "—";
}

export default function AdminJobDetailPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [job, setJob] = useState<JobApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    if (!slug || !isAuthenticated) return;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJobBySlug(slug);
        setJob(data);
      } catch {
        setError("Failed to load job.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [slug, isAuthenticated]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || "Job not found."}
        </div>
      </div>
    );
  }

  const InfoSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-700">{value ?? "—"}</dd>
    </div>
  );

  const companyName =
    job.company_name ||
    (job as { company?: { name?: string } }).company?.name ||
    "—";

  const categoryPath = (job as { unit_group?: { minor_group?: { sub_major_group?: { major_group?: { title?: string }; title?: string }; title?: string }; title?: string } }).unit_group
    ?.minor_group?.sub_major_group
    ? [
        (job as { unit_group?: { minor_group?: { sub_major_group?: { major_group?: { title?: string } } } } }).unit_group?.minor_group?.sub_major_group?.major_group?.title,
        (job as { unit_group?: { minor_group?: { sub_major_group?: { title?: string } } } }).unit_group?.minor_group?.sub_major_group?.title,
        (job as { unit_group?: { minor_group?: { title?: string } } }).unit_group?.minor_group?.title,
        (job as { unit_group?: { title?: string } }).unit_group?.title,
      ].filter(Boolean)
    : (job as { unit_group?: { title?: string } }).unit_group?.title
      ? [(job as { unit_group?: { title?: string } }).unit_group?.title]
      : [];

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/jobs"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to jobs
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">{job.title}</h1>
          <p className="text-sm text-slate-500">{companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/jobs/${slug}/edit`}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <InfoSection title="Overview">
          <InfoRow label="Company" value={companyName} />
          <InfoRow label="Employment type" value={job.employment_type} />
          <InfoRow
            label="Location"
            value={formatLocation(job.location)}
          />
          <InfoRow
            label="Posted date"
            value={
              job.posted_date
                ? format(new Date(job.posted_date), "MMM d, yyyy")
                : null
            }
          />
          <InfoRow
            label="Deadline"
            value={
              job.deadline
                ? format(new Date(job.deadline), "MMM d, yyyy")
                : null
            }
          />
          <InfoRow
            label="Applications"
            value={
              (job as { applications_count?: number }).applications_count ??
              (job as { total_applicant_count?: number }).total_applicant_count ??
              0
            }
          />
          {(job as { show_salary?: boolean }).show_salary &&
            ((job as { salary_range_min?: string }).salary_range_min ||
              (job as { salary_range_max?: string }).salary_range_max) && (
              <InfoRow
                label="Salary range"
                value={
                  (job as { salary_range_min?: string }).salary_range_min &&
                  (job as { salary_range_max?: string }).salary_range_max
                    ? `NPR ${(job as { salary_range_min?: string }).salary_range_min} – ${(job as { salary_range_max?: string }).salary_range_max}`
                    : null
                }
              />
            )}
          {(job as { required_education?: string }).required_education && (
            <InfoRow
              label="Required education"
              value={(job as { required_education?: string }).required_education}
            />
          )}
          {(job as { required_skill_level?: string }).required_skill_level && (
            <InfoRow
              label="Skill level"
              value={(job as { required_skill_level?: string }).required_skill_level}
            />
          )}
        </InfoSection>

        {categoryPath.length > 0 && (
          <InfoSection title="Job category">
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Category
              </dt>
              <dd className="mt-1 text-sm text-slate-700">
                {categoryPath.join(" › ")}
              </dd>
            </div>
          </InfoSection>
        )}

        {(job as { description?: string }).description && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Description
            </h3>
            <div
              className="prose prose-sm max-w-none text-slate-700 prose-p:leading-relaxed prose-headings:text-slate-900 rich-text-content"
              dangerouslySetInnerHTML={{
                __html: (job as { description?: string }).description as string,
              }}
            />
          </section>
        )}

        {(job as { responsibilities?: string }).responsibilities && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Responsibilities
            </h3>
            <div
              className="prose prose-sm max-w-none text-slate-700 prose-p:leading-relaxed rich-text-content"
              dangerouslySetInnerHTML={{
                __html: (job as { responsibilities?: string })
                  .responsibilities as string,
              }}
            />
          </section>
        )}

        {(job as { requirements?: string }).requirements && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Requirements
            </h3>
            <div
              className="prose prose-sm max-w-none text-slate-700 prose-p:leading-relaxed rich-text-content"
              dangerouslySetInnerHTML={{
                __html: (job as { requirements?: string }).requirements as string,
              }}
            />
          </section>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .rich-text-content ul.list-node,
        .rich-text-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          display: block !important;
        }
        .rich-text-content ul li {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          display: list-item !important;
          list-style-position: outside !important;
        }
        .rich-text-content ul li p.text-node,
        .rich-text-content ul li p {
          margin-bottom: 0 !important;
          display: inline !important;
        }
        .rich-text-content p.text-node {
          margin-bottom: 0.75rem;
        }
      `,
        }}
      />
    </div>
  );
}
