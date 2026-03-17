import { Suspense } from "react";
import { WorkInterestsView } from "@/components/jobs/WorkInterestsView";

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
