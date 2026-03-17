import { Suspense } from "react";
import { WorkInterestsView } from "@/components/jobs/WorkInterestsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Interests | BiratBazar",
  description:
    "Tell us about your work interests to get personalized job recommendations and stay updated on relevant opportunities.",
};

export default function WorkInterestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <span className="text-slate-500">Loading...</span>
        </div>
      }
    >
      <WorkInterestsView />
    </Suspense>
  );
}
