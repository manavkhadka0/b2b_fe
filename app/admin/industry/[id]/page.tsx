"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getIndustryById } from "@/services/industry";
import type { Industry } from "@/services/industry";

export default function IndustryDetailPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const industryId = params?.id ? Number(params.id) : null;

  const [industry, setIndustry] = useState<Industry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchIndustry = async () => {
      if (!industryId || !isAuthenticated) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getIndustryById(industryId);
        setIndustry(data);
      } catch {
        setError("Failed to load industry.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustry();
  }, [industryId, isAuthenticated]);

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

  if (error || !industry) {
    return (
      <div className="min-w-0 space-y-4">
        <Link
          href="/admin/industry"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to industries
        </Link>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || "Industry not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/industry"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to industries
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">{industry.name}</h1>
          <p className="text-sm text-slate-500">{industry.slug}</p>
        </div>
        <Link
          href={`/admin/industry/${industry.id}/edit`}
          className="shrink-0 self-start rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Edit
        </Link>
      </div>

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          Industry details
        </h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Name
            </dt>
            <dd className="mt-1 text-sm text-slate-700">{industry.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </dt>
            <dd className="mt-1 text-sm text-slate-700">
              {industry.email || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Website
            </dt>
            <dd className="mt-1 text-sm text-slate-700">
              {industry.website_link ? (
                <a
                  href={industry.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline"
                >
                  {industry.website_link}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              YouTube video
            </dt>
            <dd className="mt-1 text-sm text-slate-700">
              {industry.file_link ? (
                <a
                  href={industry.file_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline"
                >
                  {industry.file_link}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Description
            </dt>
            <dd className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
              {industry.description || "—"}
            </dd>
          </div>
          {industry.logo && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Logo
              </dt>
              <dd className="mt-2">
                <img
                  src={industry.logo}
                  alt={`${industry.name} logo`}
                  className="h-16 w-16 rounded object-cover"
                />
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}
