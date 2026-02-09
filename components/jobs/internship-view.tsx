"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Briefcase,
  Info,
  Sparkles,
  FileText,
} from "lucide-react";

const HIRING_COMPANIES_PDF_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}/static/pdf/industries.pdf`;

type Industry = {
  id: number;
  name: string;
  email: string;
  website_link: string;
  slug: string;
  file_link: string | null;
};

export default function InternshipView() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Industry | null>(null);

  const formatWebsiteUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const getCompanyVideoEmbedUrl = (fileLink: string | null | undefined) => {
    if (!fileLink) return null;

    try {
      const url = new URL(fileLink);

      // Handle shortened YouTube URLs (e.g. https://youtu.be/RyQmmmzWjfU)
      if (url.hostname.includes("youtu.be")) {
        const videoId = url.pathname.replace("/", "");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Handle standard YouTube URLs (e.g. https://www.youtube.com/watch?v=...)
      if (url.hostname.includes("youtube.com")) {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        // Already an embed URL
        if (url.pathname.startsWith("/embed/")) {
          return url.href;
        }
      }

      // Fallback: use the original URL in an iframe
      return url.href;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/industries/`,
        );
        if (!res.ok) {
          throw new Error("Failed to load industries");
        }

        const data: { results?: Industry[] } = await res.json();
        const list = data.results ?? [];
        setCompanies(list.slice().reverse());
      } catch (e) {
        setError("Unable to load hiring companies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleApply = () => {
    router.push("/jobs/internship/apply");
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-10 sm:px-8 sm:py-12 text-white shadow-lg">
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium mb-2">
                  <Sparkles className="h-3 w-3" />
                  Learn by doing
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Internship Opportunities
                </h1>
                <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
                  Explore internships by interest, education level, and skill
                  area. Apply to the industry of your choice and gain real-world
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm border-l-4 border-l-blue-600">
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed">
              If you are looking for an internship, you&apos;re in the right
              place. Here you can explore internship opportunities and apply to
              the industry of your choice based on your interest, education
              level, and skill area.
            </p>
            <div className="space-y-4">
              {HIRING_COMPANIES_PDF_URL && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-700" />
                    <p className="text-xs sm:text-sm text-slate-700">
                      Prefer a printable version? View the full list as PDF.
                    </p>
                  </div>
                  <a
                    href={HIRING_COMPANIES_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
                  >
                    Open PDF
                  </a>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Hiring companies
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    List of industries currently associated with internships.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {isLoading && (
                    <div className="px-4 py-6 text-sm text-slate-600">
                      Loading companies...
                    </div>
                  )}

                  {!isLoading && error && (
                    <div className="px-4 py-6 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {!isLoading && !error && companies.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-600">
                      No hiring companies found at the moment.
                    </div>
                  )}

                  {!isLoading && !error && companies.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                              Company
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                              Email
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                              Website
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                              Intro video
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {companies.map((company) => (
                            <tr
                              key={company.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="px-4 py-2 align-top text-slate-900">
                                <div className="font-medium">{company.name}</div>
                              </td>
                              <td className="px-4 py-2 align-top text-slate-700">
                                {company.email ? (
                                  <a
                                    href={`mailto:${company.email}`}
                                    className="text-blue-700 hover:text-blue-800"
                                  >
                                    {company.email}
                                  </a>
                                ) : (
                                  <span className="text-slate-400">
                                    Not provided
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 align-top text-slate-700">
                                {company.website_link ? (
                                  <a
                                    href={formatWebsiteUrl(
                                      company.website_link,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-800 break-all"
                                  >
                                    {company.website_link}
                                  </a>
                                ) : (
                                  <span className="text-slate-400">
                                    Not provided
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 align-top text-slate-700">
                                {getCompanyVideoEmbedUrl(company.file_link) ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedCompany(company)}
                                    className="text-blue-700 hover:text-blue-800 text-xs sm:text-sm font-medium underline underline-offset-2"
                                  >
                                    See video
                                  </button>
                                ) : (
                                  <span className="text-slate-400 text-xs">
                                    Not available
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {selectedCompany &&
                selectedCompany.file_link &&
                getCompanyVideoEmbedUrl(selectedCompany.file_link) && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                          Company introduction
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedCompany.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(null)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Close
                      </button>
                    </div>
                    <div className="relative w-full pt-[56.25%] overflow-hidden rounded-lg bg-black/5">
                      <iframe
                        src={getCompanyVideoEmbedUrl(
                          selectedCompany.file_link,
                        )!}
                        className="absolute inset-0 h-full w-full rounded-lg border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={`${selectedCompany.name} introduction video`}
                      />
                    </div>
                  </div>
                )}
            </div>

            <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Important information
                  </p>
                  <p className="text-sm text-blue-800/90 leading-relaxed">
                    After you apply, the industry may contact you if your
                    profile matches their requirements and if there is available
                    space. Internship placement and work-based learning will be
                    conducted as per the college/school requirements and the
                    industry&apos;s own policies (including documents, duration,
                    rules, and reporting).
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-slate-700 font-medium">Ready to begin?</p>
              <Button
                onClick={handleApply}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-md"
                size="lg"
              >
                <Briefcase className="h-4 w-4" />
                Start application
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
