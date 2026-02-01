export type ItemType = 'WISH' | 'OFFER';
export type Category = 'Agriculture' | 'Technology' | 'Manufacturing' | 'Textiles' | 'Tourism' | 'Finance';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';

export interface B2BItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location: string;
  postedBy: string; // Company Name
  date: string;
  tags: string[];
  isService: boolean; // Product vs Service
  imageUrl?: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  type: JobType;
  postedDate: string;
  requirements: string[];
  isApplied?: boolean;
}

// API Response Types
export interface JobLocation {
  id: number;
  name: string;
  slug: string;
}

export interface JobUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  bio: string;
  date_of_birth: string | null;
  phone_number: string;
  address: string;
  designation: string;
  alternate_no: string | null;
  avatar: string | null;
}

export interface MajorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
}

export interface SubMajorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
  major_group: MajorGroup;
}

export interface MinorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
  sub_major_group: SubMajorGroup;
}

export interface UnitGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  minor_group: MinorGroup;
}

export interface JobApiResponse {
  id: number;
  title: string;
  company_name: string | null;
  user: JobUser;
  slug: string;
  location: JobLocation[];
  status: string;
  posted_date: string;
  deadline: string;
  employment_type: string;
  applications_count: number;
  views_count: number;
  salary_range_min: string;
  salary_range_max: string;
  show_salary: boolean;
  unit_group: UnitGroup;
  has_already_saved: boolean;
  total_applicant_count: number;
  job_post_count: number;
  is_applied?: boolean;
}

export interface JobsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobApiResponse[];
}

export interface JobApplication {
  id: number;
  job: JobApiResponse;
  applied_date: string;
  cover_letter: string;
  status: string;
  updated_at: string;
  applicant: number;
}

export interface AppliedJobsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobApplication[];
}

export interface UserStats {
  wishesActive: number;
  offersActive: number;
  connectionsMade: number;
  views: number;
}