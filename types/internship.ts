/** Single internship registration */
export interface InternshipRegistration {
  id?: number;
  full_name: string | null;
  permanent_district: string | null;
  permanent_municipality: string | null;
  permanent_province: string | null;
  permanent_ward: string | null;
  current_district: string | null;
  current_municipality: string | null;
  current_province: string | null;
  current_ward: string | null;
  contact_number: string | null;
  email: string | null;
  date_of_birth: string | null;
  motivational_letter: string | null;
  supervisor_name: string | null;
  supervisor_email: string | null;
  supervisor_phone: string | null;
  internship_industry: number | null;
  preferred_department: string | null;
  internship_duration: string | null;
  internship_month: string | null;
  preferred_start_date: string | null;
  availability: string | null;
}

/** Paginated list response from /api/internship/register/ */
export interface InternshipRegistrationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InternshipRegistration[];
}

/** Industry from /api/industries/ */
export interface Industry {
  id: number;
  name: string;
  description?: string;
  link?: string;
  slug?: string;
}
