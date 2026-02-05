"use client";

import React from "react";
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

export default function InternshipView() {
  const router = useRouter();

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
            <a
              href={HIRING_COMPANIES_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              <FileText className="h-4 w-4" />
              See hiring companies
            </a>

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
