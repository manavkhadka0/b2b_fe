export interface JobApplicationUser {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  bio?: string;
  date_of_birth?: string | null;
  phone_number?: string;
  address?: string;
  designation?: string;
  alternate_no?: string | null;
  avatar?: string | null;
}

export interface UnitGroupMajorGroup {
  id: number;
  code: string;
  title: string;
  slug?: string;
  description?: string;
}

export interface UnitGroupSubMajorGroup {
  id: number;
  code: string;
  title: string;
  slug?: string;
  description?: string;
  major_group?: UnitGroupMajorGroup;
}

export interface UnitGroupMinorGroup {
  id: number;
  code: string;
  title: string;
  slug?: string;
  description?: string;
  sub_major_group?: UnitGroupSubMajorGroup;
}

export interface JobUnitGroup {
  id: number;
  code: string;
  title: string;
  slug?: string;
  minor_group?: UnitGroupMinorGroup;
}

export interface JobApplicationJob {
  id: number;
  title: string;
  company_name: string;
  slug: string;
  location?: string | null;
  status?: string;
  posted_date?: string | null;
  deadline?: string | null;
  employment_type?: string;
  applications_count?: number;
  views_count?: number;
  no_of_vacancy?: number;
  salary_range_min?: string;
  salary_range_max?: string;
  show_salary?: boolean;
  total_applicant_count?: number;
  has_already_saved?: boolean;
  is_applied?: boolean;
  unit_group?: JobUnitGroup;
  user?: JobApplicationUser;
}

export interface JobApplication {
  id: number;
  job: JobApplicationJob;
  applied_date: string;
  cover_letter?: string | null;
  status: string;
  updated_at?: string;
  applicant: number;
}

export interface JobApplicationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobApplication[];
}
