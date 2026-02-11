/**
 * Graduate Roster types – aligned with Django GraduateRoster model.
 */

export const LEVEL_COMPLETED_CHOICES = [
  "Pre-Diploma",
  "Diploma",
  "TSLC",
  "Short Course",
  "Bachelor",
  "Other",
] as const;

export const CERTIFYING_AGENCY_CHOICES = [
  "CTEVT",
  "University",
  "Other",
] as const;

export const JOB_STATUS_CHOICES = [
  "Available for Job",
  "Not Available",
] as const;

export type LevelCompleted = (typeof LEVEL_COMPLETED_CHOICES)[number];
export type CertifyingAgency = (typeof CERTIFYING_AGENCY_CHOICES)[number];
export type JobStatus = (typeof JOB_STATUS_CHOICES)[number];

/** Institute as returned in graduate list/detail (nested object) */
export interface GraduateRosterInstitute {
  id: number;
  institute_name: string;
  institute_type?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward_no?: number;
  phone_number?: string;
  website?: string | null;
  email?: string;
  logo?: string | null;
  primary_contact_person?: string;
  primary_contact_person_phone?: string;
  primary_contact_person_email?: string;
  primary_contact_person_designation?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GraduateRoster {
  id: number;
  institute: number | GraduateRosterInstitute | null;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  permanent_province: string;
  permanent_district: string;
  permanent_municipality: string;
  permanent_ward: string;
  current_province: string | null;
  current_district: string | null;
  current_municipality: string | null;
  current_ward: string | null;
  level_completed: LevelCompleted | null;
  subject_trade_stream: string | null;
  specialization_key_skills: string | null;
  passed_year: number | null;
  certifying_agency: CertifyingAgency | null;
  certifying_agency_name: string | null;
  certificate_id: string | null;
  job_status: JobStatus;
  available_from: string | null;
  created_at: string;
  updated_at: string;
}

/** Payload for POST /api/graduates/ */
export interface CreateGraduateRosterPayload {
  institute?: number | null;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  permanent_province: string;
  permanent_district: string;
  permanent_municipality: string;
  permanent_ward: string;
  current_province?: string | null;
  current_district?: string | null;
  current_municipality?: string | null;
  current_ward?: string | null;
  level_completed?: LevelCompleted | null;
  subject_trade_stream?: string | null;
  specialization_key_skills?: string | null;
  passed_year?: number | null;
  certifying_agency?: CertifyingAgency | null;
  certifying_agency_name?: string | null;
  certificate_id?: string | null;
  job_status?: JobStatus;
  available_from?: string | null;
}
