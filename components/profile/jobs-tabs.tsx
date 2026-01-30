"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Job } from "@/types/types";
import { JobCard } from "@/components/jobs/JobCard";

interface JobsTabsProps {
  myJobs: Job[];
  appliedJobs: Job[];
  myJobsLoading: boolean;
  appliedJobsLoading: boolean;
  onEditJob?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export function JobsTabs({
  myJobs,
  appliedJobs,
  myJobsLoading,
  appliedJobsLoading,
  onEditJob,
  onApply,
}: JobsTabsProps) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-5">
      <Tabs defaultValue="my-jobs" className="w-full">
        <div className="border-b border-gray-100 px-1 sm:px-2 mb-3 sm:mb-4">
          <TabsList className="bg-transparent h-auto p-0 gap-4 justify-start">
            <TabsTrigger
              value="my-jobs"
              className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm md:text-base font-semibold text-gray-500 data-[state=active]:text-blue-600"
            >
              My Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applied-jobs"
              className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm md:text-base font-semibold text-gray-500 data-[state=active]:text-green-600"
            >
              Applied Jobs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="my-jobs" className="m-0 mt-2">
          {myJobsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          ) : myJobs.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              You have not posted any jobs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {myJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showApplyButton={false}
                  showEditButton={!!onEditJob}
                  onEdit={onEditJob}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applied-jobs" className="m-0 mt-2">
          {appliedJobsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
            </div>
          ) : appliedJobs.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              You have not applied to any jobs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {appliedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showApplyButton={false}
                  showEditButton={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
