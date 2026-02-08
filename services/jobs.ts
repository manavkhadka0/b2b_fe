import { JobsApiResponse, AppliedJobsApiResponse } from "@/types/types";
import { api } from "@/lib/api";
import type { Content } from "@tiptap/react";
import { UnitGroup } from "@/types/unit-groups";
import { Location } from "@/types/auth";

export type EmploymentTypeFilter = "Full Time" | "Part Time" | "Contract" | "Internship" | "All";

export type ListingTimeFilter =
  | "Last 24 hours"
  | "Last 3 days"
  | "Last 7 days"
  | "Last 14 days"
  | "Last 30 days";

/** Response from /api/search-groups/ - search job categories by code or title */
export interface SearchGroupResponse {
  counts: {
    major_groups: number;
    sub_major_groups: number;
    minor_groups: number;
    unit_groups: number;
    total: number;
  };
  results: {
    major_groups: Array<{ code: string; title: string }>;
    sub_major_groups: Array<{ code: string; title: string }>;
    minor_groups: Array<{ code: string; title: string }>;
    unit_groups: Array<{ code: string; title: string }>;
  };
}

export async function searchGroups(query: string): Promise<SearchGroupResponse | null> {
  if (!query || !query.trim()) return null;
  try {
    const response = await api.get<SearchGroupResponse>(
      `/api/search-groups/?search_group=${encodeURIComponent(query.trim())}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to search groups:", error);
    return null;
  }
}

export async function getJobs(
  search?: string,
  employment_type?: EmploymentTypeFilter,
  unit_groups?: string[],
  minor_groups?: string[],
  listing_time?: ListingTimeFilter,
  salary_min?: string,
  salary_max?: string,
  page?: number
): Promise<JobsApiResponse> {
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (employment_type && employment_type !== "All") {
      params.append("employment_type", employment_type);
    }
    if (unit_groups && unit_groups.length > 0) {
      params.append("unit_groups", unit_groups.join(","));
    }
    if (minor_groups && minor_groups.length > 0) {
      params.append("minor_groups", minor_groups.join(","));
    }
    if (listing_time) {
      params.append("listing_time", listing_time);
    }
    if (salary_min && salary_min.trim()) {
      params.append("salary_min", salary_min.trim());
    }
    if (salary_max && salary_max.trim()) {
      params.append("salary_max", salary_max.trim());
    }
    if (page != null && page > 1) {
      params.append("page", String(page));
    }
    const queryString = params.toString();
    const url = `/api/jobs/${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<JobsApiResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

export async function applyToJob(jobSlug: string, coverLetter: Content): Promise<void> {
  try {
    // Convert cover letter to HTML string
    // The editor outputs HTML when output="html" is set
    let coverLetterHtml: string;
    
    if (typeof coverLetter === 'string') {
      coverLetterHtml = coverLetter;
    } else if (coverLetter && typeof coverLetter === 'object') {
      // If it's JSON content, we need to convert it to HTML
      // For now, stringify it - backend should handle it
      coverLetterHtml = JSON.stringify(coverLetter);
    } else {
      coverLetterHtml = '';
    }
    
    await api.post(`/api/jobs/${jobSlug}/apply/`, {
      cover_letter: coverLetterHtml,
    });
  } catch (error) {
    console.error("Failed to apply to job:", error);
    throw error;
  }
}

export async function getUnitGroups(search?: string): Promise<UnitGroup[]> {
  try {
    const params = new URLSearchParams();
    if (search?.trim()) params.append("search", search.trim());
    const query = params.toString();
    const response = await api.get<{ results: UnitGroup[] }>(
      `/api/unit-groups/${query ? `?${query}` : ""}`,
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch unit groups:", error);
    return [];
  }
}

export async function getLocations(): Promise<Location[]> {
  try {
    const response = await api.get<{ results: Location[] }>("/api/locations/");
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string) {
  try {
    const response = await api.get(`/api/jobs/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job:", error);
    throw error;
  }
}

export async function getMyJobs(): Promise<JobsApiResponse> {
  try {
    const response = await api.get<JobsApiResponse>("/api/my-jobs/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch my jobs:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

export async function getAppliedJobs(): Promise<AppliedJobsApiResponse> {
  try {
    const response = await api.get<AppliedJobsApiResponse>("/api/applied-jobs/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch applied jobs:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}
