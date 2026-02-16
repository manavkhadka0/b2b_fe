/** Uploaded document in apprenticeship application */
export interface ApprenticeshipUploadedDocument {
  id: number;
  document: string;
  name: string;
  uploaded_at: string;
}

/** Single apprenticeship application */
export interface ApprenticeshipApplication {
  id: number;
  uploaded_documents: ApprenticeshipUploadedDocument[];
  full_name: string;
  mobile_number: string;
  email_address: string;
  province: string | null;
  district: string | null;
  municipality: string | null;
  ward: string | null;
  date_of_birth: string;
  gender: string;
  education_level: string;
  school_name: string;
  year_of_see_completion: string;
  trade: string;
  preferred_training_provider: string;
  preferred_location: string;
  motivation_letter: string;
  citizenship: string;
  created_at: string;
  industry_preference_1: number | null;
  industry_preference_2: number | null;
  industry_preference_3: number | null;
}

/** Paginated list response from /api/apprenticeship/applications/ */
export interface ApprenticeshipApplicationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApprenticeshipApplication[];
}

/** Partial payload for PATCH update */
export type ApprenticeshipApplicationUpdate = Partial<
  Omit<ApprenticeshipApplication, "id" | "created_at" | "uploaded_documents">
>;
