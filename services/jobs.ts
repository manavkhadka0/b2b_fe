import { JobsApiResponse, AppliedJobsApiResponse } from "@/types/types";
import { api } from "@/lib/api";
import type { Content } from "@tiptap/react";
import { UnitGroup } from "@/types/unit-groups";
import { Location } from "@/types/auth";

export async function getJobs(search?: string): Promise<JobsApiResponse> {
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const queryString = params.toString();
    const url = `/api/jobs/${queryString ? `?${queryString}` : ''}`;
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

export async function getUnitGroups(): Promise<UnitGroup[]> {
  try {
    const response = await api.get<{ results: UnitGroup[] }>("/api/unit-groups/");
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
