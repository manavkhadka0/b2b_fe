import { UnitGroup } from "./unit-groups";

export interface CompanyData {
  slug: string;
}

export interface JobSeekerData {
  slug: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  gender: Gender;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  company_data: CompanyData | null;
  jobseeker_data: JobSeekerData | null;
}

export interface AuthContextType {
  user: User | null;
  isJobSeeker: boolean;
  login: (credentials: LoginCredentials, returnTo?: string) => Promise<void>;
  signup: (data: SignupData, returnTo?: string) => Promise<void>;
  logout: (returnTo?: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkJobSeeker: () => Promise<boolean>;
  isLoading: boolean;
  requireAuth: (returnTo: string) => void;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type Gender = "Male" | "Female" | "Other";

export type UserType = "Job Seeker" | "Employer";

export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship"
  | "All";

export type CourseOrQualification =
  | "General Literate"
  | "Below SLC"
  | "+2"
  | "Bachelors"
  | "Master & above"
  | "Pre-Diploma"
  | "Diploma"
  | "TLSC"
  | "No Education";

export interface SignupData {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
  gender: Gender;
  address: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  phone_number: string;
  company_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Education {
  id: number;
  course_or_qualification: CourseOrQualification;
  institution: string;
  year_of_completion?: string;
  course_highlights?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuing_organisation: string;
  issue_date?: string;
  expiry_date?: string;
  description?: string;
}

export interface CareerHistory {
  id: number;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  description: string;
}
export interface Skill {
  id: number;
  name: string;
}

export type SkillLevel =
  | "RPL"
  | "Level 1"
  | "Level 2"
  | "Level 3"
  | "Level 4"
  | "Level 5"
  | "Level 6"
  | "Level 7"
  | "Level 8";

export type JobSeekerProfile = {
  id: number;
  user: User;
  skills: Skill[];
  cv?: string;
  skill_levels: SkillLevel[];
  education: Education[];
  preferred_unit_groups: UnitGroup[];
  work_experience: number;
  preferred_locations: Location[];
  preferred_salary_range_from: number;
  already_hired?: boolean;
  preferred_salary_range_to: number;
  remote_work_preference: boolean;
  bio: string;
  availability: "Full Time" | "Part Time" | "Contract" | "Internship";
  certifications: Certification[];
  languages: Language[];
  career_history: CareerHistory[];
  slug: string;
};

export interface Industry {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1001+";

export interface CompanyProfile {
  id: number;
  user: User;
  company_name: string;
  slug: string;
  industry: Industry;
  company_size: CompanySize;
  registration_number: string;
  website?: string;
  description: string;
  logo?: string;
  established_date?: string;
  company_email: string;
  company_registration_certificate?: string;
  is_verified: boolean;
}
