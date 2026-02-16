import { api } from "@/lib/api";
import type {
  InternshipRegistration,
  InternshipRegistrationsResponse,
  Industry,
} from "@/types/internship";

const REGISTER_BASE = "/api/internship/register/";
const INDUSTRIES_BASE = "/api/industries/";

/**
 * List internship registrations (paginated)
 */
export async function getInternshipRegistrations(
  page?: number,
): Promise<InternshipRegistrationsResponse> {
  const params = new URLSearchParams();
  if (page != null && page > 1) {
    params.append("page", String(page));
  }
  const query = params.toString();
  const url = `${REGISTER_BASE}${query ? `?${query}` : ""}`;
  const { data } = await api.get<InternshipRegistrationsResponse>(url);
  return data;
}

/**
 * Get a single internship registration by id
 */
export async function getInternshipRegistrationById(
  id: number,
): Promise<InternshipRegistration> {
  const { data } = await api.get<InternshipRegistration>(
    `${REGISTER_BASE}${id}/`,
  );
  return data;
}

/**
 * Delete an internship registration
 */
export async function deleteInternshipRegistration(
  id: number,
): Promise<void> {
  await api.delete(`${REGISTER_BASE}${id}/`);
}

/**
 * List industries (for resolving internship_industry id)
 */
export async function getIndustries(): Promise<Industry[]> {
  try {
    const { data } = await api.get<Industry[] | { results?: Industry[] }>(
      INDUSTRIES_BASE,
    );
    return Array.isArray(data) ? data : (data?.results ?? []);
  } catch {
    return [];
  }
}
