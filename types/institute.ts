/**
 * Institute types – aligned with Django Institute model.
 */

export const INSTITUTE_TYPE_CHOICES = [
  "Technical School",
  "Polytechnic",
  "Training Centre",
  "College",
] as const;

export type InstituteType = (typeof INSTITUTE_TYPE_CHOICES)[number];

export interface Institute {
  id: number;
  institute_name: string;
  institute_type: InstituteType;
  province: string;
  district: string;
  municipality: string;
  ward_no: number;
  phone_number: string;
  website: string | null;
  email: string;
  logo: string | null;
  primary_contact_person: string;
  primary_contact_person_phone: string;
  primary_contact_person_email: string;
  primary_contact_person_designation: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/** Optional response extras when backend sends verification info after create */
export interface CreateInstituteResponseExtras {
  verification_link?: string;
  uidb64?: string;
  token?: string;
}

/** Payload for POST /api/institute/ */
export interface CreateInstitutePayload {
  institute_name: string;
  institute_type: InstituteType;
  province: string;
  district: string;
  municipality: string;
  ward_no: number;
  phone_number: string;
  website?: string | null;
  email: string;
  primary_contact_person: string;
  primary_contact_person_phone: string;
  primary_contact_person_email: string;
  primary_contact_person_designation: string;
}
