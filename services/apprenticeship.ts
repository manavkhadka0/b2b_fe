import { api } from "@/lib/api";
import type {
  ApprenticeshipApplication,
  ApprenticeshipApplicationsResponse,
  ApprenticeshipApplicationUpdate,
} from "@/types/apprenticeship";

const BASE = "/api/apprenticeship/applications/";

/**
 * List apprenticeship applications (paginated)
 */
export async function getApprenticeshipApplications(
  page?: number,
): Promise<ApprenticeshipApplicationsResponse> {
  const params = new URLSearchParams();
  if (page != null && page > 1) {
    params.append("page", String(page));
  }
  const query = params.toString();
  const url = `${BASE}${query ? `?${query}` : ""}`;
  const { data } = await api.get<ApprenticeshipApplicationsResponse>(url);
  return data;
}

/**
 * Get a single apprenticeship application by id
 */
export async function getApprenticeshipApplicationById(
  id: number,
): Promise<ApprenticeshipApplication> {
  const { data } = await api.get<ApprenticeshipApplication>(`${BASE}${id}/`);
  return data;
}

/**
 * Update an apprenticeship application (PATCH)
 */
export async function updateApprenticeshipApplication(
  id: number,
  payload: ApprenticeshipApplicationUpdate,
): Promise<ApprenticeshipApplication> {
  const { data } = await api.patch<ApprenticeshipApplication>(
    `${BASE}${id}/`,
    payload,
  );
  return data;
}

/**
 * Delete an apprenticeship application
 */
export async function deleteApprenticeshipApplication(
  id: number,
): Promise<void> {
  await api.delete(`${BASE}${id}/`);
}
