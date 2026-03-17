import { Suspense } from "react";
import JobsView from "@/components/jobs/JobsView";

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
