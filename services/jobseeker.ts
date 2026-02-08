/**
 * Jobseeker profile API – mirrors jobbriz_fe-main app/jobseeker/dashboard/profile/me and forms.
 * GET /api/jobseekers/{username}/
 * PATCH /api/jobseekers/{username}/
 * POST/DELETE /api/education/, /api/career-history/, /api/certifications/, /api/skills/
 */

import { api } from "@/lib/api";
import type {
  CvProfile,
  CvEducation,
  CvCareerHistory,
  CvCertification,
  CvSkill,
  CvAvailability,
} from "@/types/cv";
import { emptyCvProfile } from "@/types/cv";

/** API response shape for jobseeker profile (matches backend). */
export interface JobSeekerProfileApi {
  id: number;
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    address?: string;
  };
  bio?: string;
  education: Array<{
    id: number;
    course_or_qualification: string;
    institution: string;
    year_of_completion?: string;
    course_highlights?: string;
  }>;
  career_history: Array<{
    id: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuing_organisation: string;
    issue_date?: string;
    expiry_date?: string;
    description?: string;
  }>;
  skills: Array<{ id: number; name: string }>;
  work_experience?: number | string;
  availability?: string;
  remote_work_preference?: boolean;
  preferred_salary_range_from?: number;
  preferred_salary_range_to?: number;
  slug?: string;
}

export function mapApiToCvProfile(data: JobSeekerProfileApi | null): CvProfile {
  if (!data) return emptyCvProfile();
  const workExp =
    typeof data.work_experience === "string"
      ? parseWorkExperienceYears(data.work_experience)
      : Number(data.work_experience) || 0;
  return {
    bio: data.bio ?? "",
    education: (data.education ?? []).map((e) => ({
      id: e.id,
      course_or_qualification: e.course_or_qualification,
      institution: e.institution,
      year_of_completion: e.year_of_completion,
      course_highlights: e.course_highlights,
    })),
    career_history: (data.career_history ?? []).map((c) => ({
      id: c.id,
      company_name: c.company_name,
      job_title: c.job_title,
      start_date: c.start_date,
      end_date: c.end_date,
      description: c.description,
    })),
    certifications: (data.certifications ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      issuing_organisation: c.issuing_organisation,
      issue_date: c.issue_date,
      expiry_date: c.expiry_date,
      description: c.description,
    })),
    skills: (data.skills ?? []).map((s) => ({ id: s.id, name: s.name })),
    work_experience: workExp,
    availability: (data.availability as CvAvailability) ?? "Full Time",
    remote_work_preference: data.remote_work_preference ?? false,
    preferred_salary_range_from: Number(data.preferred_salary_range_from) ?? 0,
    preferred_salary_range_to: Number(data.preferred_salary_range_to) ?? 0,
  };
}

/** Parse "2 years" / "6 months" to number of years. */
function parseWorkExperienceYears(s: string): number {
  if (!s || typeof s !== "string") return 0;
  const n = parseFloat(s);
  if (s.toLowerCase().includes("month")) return Math.round((n / 12) * 10) / 10;
  return n;
}

/** Format years number to API format "X years". */
function formatWorkExperienceForApi(years: number): string {
  if (years <= 0) return "0 years";
  return years === 1 ? "1 year" : `${years} years`;
}

/** Error code returned when no jobseeker profile exists yet. */
export const PROFILE_NOT_FOUND_CODE = "profile_not_found";

export function isProfileNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("response" in err)) return false;
  const res = (
    err as { response?: { status?: number; data?: { code?: string } } }
  ).response;
  const code = res?.data?.code;
  if (code === PROFILE_NOT_FOUND_CODE) return true;
  if (res?.status === 404 && code == null) return true;
  return false;
}

export async function hasJobseekerProfile(): Promise<boolean> {
  const { data } = await api.get<boolean>(`/api/has-profile/`);
  return Boolean(data);
}

export async function getJobseekerProfile(): Promise<JobSeekerProfileApi> {
  const { data } = await api.get<JobSeekerProfileApi>(
    `/api/jobseekers/detail/`,
  );
  return data;
}

/**
 * Create a new jobseeker profile for the current user.
 * Uses the auth token (no body required; backend creates profile from user).
 */
export async function createJobseekerProfile(): Promise<JobSeekerProfileApi> {
  const { data } = await api.post<JobSeekerProfileApi>("/api/jobseekers/", {});
  return data;
}

export async function updateJobseekerProfile(
  payload: Partial<{
    bio: string;
    work_experience: number | string;
    availability: string;
    remote_work_preference: boolean;
    preferred_salary_range_from: number;
    preferred_salary_range_to: number;
  }>,
): Promise<JobSeekerProfileApi> {
  const body: Record<string, unknown> = { ...payload };
  if (typeof body.work_experience === "number") {
    body.work_experience = formatWorkExperienceForApi(
      body.work_experience as number,
    );
  }
  const { data } = await api.patch<JobSeekerProfileApi>(
    `/api/jobseekers/detail/`,
    body,
  );
  return data;
}

export async function addEducation(
  username: string,
  payload: {
    course_or_qualification: string;
    institution: string;
    year_of_completion?: string;
    course_highlights?: string;
  },
): Promise<JobSeekerProfileApi> {
  await api.post("/api/education/", payload);
  return getJobseekerProfile();
}

export async function deleteEducation(
  username: string,
  id: number,
): Promise<JobSeekerProfileApi> {
  await api.delete(`/api/education/${id}/`);
  return getJobseekerProfile();
}

export async function addCareerHistory(
  username: string,
  payload: {
    company_name: string;
    job_title: string;
    start_date: string;
    end_date?: string;
    description?: string;
  },
): Promise<JobSeekerProfileApi> {
  await api.post("/api/career-history/", payload);
  return getJobseekerProfile();
}

export async function deleteCareerHistory(
  username: string,
  id: number,
): Promise<JobSeekerProfileApi> {
  await api.delete(`/api/career-history/${id}/`);
  return getJobseekerProfile();
}

export async function addCertification(
  username: string,
  payload: {
    name: string;
    issuing_organisation: string;
    issue_date?: string;
    expiry_date?: string;
    description?: string;
  },
): Promise<JobSeekerProfileApi> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("issuing_organisation", payload.issuing_organisation);
  formData.append("description", payload.description ?? "");
  if (payload.issue_date) formData.append("issue_date", payload.issue_date);
  if (payload.expiry_date) formData.append("expiry_date", payload.expiry_date);
  await api.post("/api/certifications/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return getJobseekerProfile();
}

export async function deleteCertification(
  username: string,
  id: number,
): Promise<JobSeekerProfileApi> {
  await api.delete(`/api/certifications/${id}/`);
  return getJobseekerProfile();
}

export async function addSkill(
  username: string,
  payload: { name: string },
): Promise<JobSeekerProfileApi> {
  await api.post("/api/skills/", payload);
  return getJobseekerProfile();
}

export async function deleteSkill(
  username: string,
  id: number,
): Promise<JobSeekerProfileApi> {
  await api.delete(`/api/skills/${id}/`);
  return getJobseekerProfile();
}
