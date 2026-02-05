"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, AlertCircle, Compass } from "lucide-react";

const testUrl = "https://quiz-g2u0.onrender.com/";

export default function CareerGuidanceView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-blue-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-10 sm:px-8 sm:py-12 text-white shadow-lg">
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Career Guidance
                </h1>
                <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
                  Understand your interests and strengths. Explore pathways in
                  jobs, skills training, higher education, and entrepreneurship.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm border-l-4 border-l-blue-600">
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed">
              Career decisions become easier when you understand your interests,
              strengths, and the opportunities around you. Start with our Career
              Interest Test and explore pathways in jobs, skills training,
              higher education, and entrepreneurship.
            </p>

            <div className="pt-2">
              <Button
                onClick={() => window.open(testUrl, "_blank")}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-md"
                size="lg"
              >
                <ExternalLink className="h-4 w-4" />
                Start Career Interest Test
              </Button>
            </div>

            <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Disclaimer
                  </p>
                  <p className="text-sm text-blue-800/90 leading-relaxed">
                    This test provides guidance only. Final decisions should
                    consider your personal situation, qualifications, and
                    consultation with qualified career counselors or mentors
                    associated with this program
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm border-l-4 border-l-blue-600">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            For more information and details, please contact:
          </h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200">
              <Image
                src="/guidance.png"
                alt="Career Guidance Contact Information"
                width={1200}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
