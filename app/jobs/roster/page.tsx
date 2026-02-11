import RosterView from "@/components/jobs/roster/roster-view";
import { Suspense } from "react";

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
