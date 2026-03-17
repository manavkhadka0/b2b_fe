import { Suspense } from "react";
import JobsView from "@/components/jobs/JobsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs and Opportunities | BiratBazar",
  description:
    "Find latest job openings, internships, and apprenticeships in various industries in Nepal. Connect with potential employers and grow your career.",
  keywords: ["Jobs", "Career", "Internships", "Nepal", "Employment", "BiratBazar"],
};

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <span className="text-slate-500">Loading...</span>
        </div>
      }
    >
      <JobsView />
    </Suspense>
  );
}
