/** CV / Jobseeker profile types for the profile CV tab (local state; API can be wired later). */

export interface CvEducation {
  id: number;
  course_or_qualification: string;
  institution: string;
  year_of_completion?: string;
  course_highlights?: string;
}

export interface CvCareerHistory {
  id: number;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface CvCertification {
  id: number;
  name: string;
  issuing_organisation: string;
  issue_date?: string;
  expiry_date?: string;
  description?: string;
}

export interface CvSkill {
  id: number;
  name: string;
}

export type CvAvailability =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship";

export interface CvProfile {
  bio: string;
  education: CvEducation[];
  career_history: CvCareerHistory[];
  certifications: CvCertification[];
  skills: CvSkill[];
  work_experience: number;
  availability: CvAvailability;
  remote_work_preference: boolean;
  preferred_salary_range_from: number;
  preferred_salary_range_to: number;
}

export const emptyCvProfile = (): CvProfile => ({
  bio: "",
  education: [],
  career_history: [],
  certifications: [],
  skills: [],
  work_experience: 0,
  availability: "Full Time",
  remote_work_preference: false,
  preferred_salary_range_from: 0,
  preferred_salary_range_to: 0,
});
