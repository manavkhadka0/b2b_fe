import { api } from "@/lib/api";
import type { JobApplicationsResponse } from "@/types/application";

/**
 * Fetch applications for a specific job by its slug or query params
 * e.g. /api/applications/?job=job_slug
 */
export async function getJobApplications(jobSlug: string): Promise<JobApplicationsResponse> {
  const { data } = await api.get<JobApplicationsResponse>(
    `/api/applications/?job=${encodeURIComponent(jobSlug)}`
  );
  return data;
}
