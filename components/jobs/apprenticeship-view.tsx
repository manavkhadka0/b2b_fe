"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Briefcase,
  Info,
  Calendar,
  CheckCircle2,
  GraduationCap,
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

export default function ApprenticeshipView() {
  const router = useRouter();

  const [showCompanies, setShowCompanies] = useState(false);
  const [companies, setCompanies] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Industry | null>(null);

  const handleToggleCompanies = async () => {
    const shouldLoad = !showCompanies && companies.length === 0;

    if (shouldLoad) {
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
        setCompanies(data.results ?? []);
      } catch (e) {
        setError("Unable to load hiring companies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (showCompanies) {
      setSelectedCompany(null);
    }

    setShowCompanies((prev) => !prev);
  };

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

  const handleApply = () => {
    router.push("/jobs/apprenticeship/apply");
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-10 sm:px-8 sm:py-12 text-white shadow-lg">
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium mb-2">
                  TVET · CTEVT
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Apprenticeship Program
                </h1>
                <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
                  24-month industry-led program under Pre-Diploma TVET (CTEVT).
                  Practice-focused training with industry placement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm border-l-4 border-l-blue-600">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                About the program
              </h2>
              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p>
                  Chamber of Industries Morang (CIM) facilitates a 24-month
                  Apprenticeship Training Program under the Pre-Diploma level
                  TVET track of CTEVT. The training is industry-led and
                  practice-focused, consisting of 19.6 months in industries and
                  3.6 months in a training institute.
                </p>
                <p>
                  The program is implemented by the Ministry of Social
                  Development, Koshi Province with technical support from the
                  ENSSURE Project, financed by the Swiss Agency for Development
                  and Cooperation (SDC). Intake is generally planned in Bhadra
                  (August–September).
                </p>
                <p>
                  As a private sector actor, CIM leads the program on behalf of
                  industries by establishing a dedicated Skill Development Unit
                  (SDU) to coordinate industry placements, institute training,
                  compliance, monitoring, and apprentice support.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleCompanies}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              <FileText className="h-4 w-4" />
              {showCompanies ? "Hide hiring companies" : "See hiring companies"}
            </button>

            {showCompanies && (
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
                      List of industries currently associated with the
                      apprenticeship program.
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
                                  <div className="font-medium">
                                    {company.name}
                                  </div>
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
                                      View video
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
            )}

            <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Industry placement assurance
                  </h3>
                  <p className="text-sm text-blue-800/90 leading-relaxed">
                    This section supports students applying for the 24-month
                    Apprenticeship Training Program (Pre-Diploma TVET). To join,
                    applicants generally need an Industry Placement Assurance
                    Letter confirming a seat for apprenticeship placement.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Timeline (typical)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Apply by:</strong> June 30 (recommended)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Assurance letter:</strong> July (~1 month before
                        intake)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Intake:</strong> Bhadra (August–September)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Important note
                  </p>
                  <p className="text-sm text-blue-800/90 leading-relaxed">
                    After you apply, industries / CIM will respond based on seat
                    availability and matching (trade interest, institute, basic
                    eligibility, and motivation). This is an assurance request
                    process (not final enrolment). Final admission is subject to
                    program rules, institute requirements, and industry
                    capacity.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-slate-700 font-medium">
                Ready to apply for Industry Placement Assurance?
              </p>
              <Button
                onClick={handleApply}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-md"
                size="lg"
              >
                <Briefcase className="h-4 w-4" />
                Apply for program
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
