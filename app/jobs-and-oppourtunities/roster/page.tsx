import RosterView from "@/components/jobs/roster/roster-view";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talent Roster | BiratBazar",
  description:
    "Browse our curated roster of skilled professionals and job seekers ready to contribute to your business.",
};

export default function RosterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <span className="text-slate-500">Loading...</span>
        </div>
      }
    >
      <RosterView />
    </Suspense>
  );
}
