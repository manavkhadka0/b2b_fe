/**
 * Graduate Roster API – /api/graduates/ (paginated) and /api/graduates/<id>/
 */

import { api } from "@/lib/api";
import type {
  GraduateRoster,
  CreateGraduateRosterPayload,
  LevelCompleted,
  JobStatus,
  CertifyingAgency,
} from "@/types/graduate-roster";

export interface GraduatesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GraduateRoster[];
}

export interface GetGraduatesParams {
  page?: number;
  search?: string;
  trade_stream?: string;
  level?: LevelCompleted | "";
  passed_year_min?: number;
  passed_year_max?: number;
  district?: string;
  municipality?: string;
  status?: JobStatus | "";
  certifying_agency?: CertifyingAgency | "";
  institution_name?: string;
}

export async function getGraduates(
  params?: GetGraduatesParams,
): Promise<GraduatesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
   // Django Filter fields
  if (params?.trade_stream?.trim()) {
    searchParams.set("trade_stream", params.trade_stream.trim());
  }
  if (params?.level) {
    searchParams.set("level", params.level);
  }
  if (params?.passed_year_min != null) {
    searchParams.set("passed_year_min", String(params.passed_year_min));
  }
  if (params?.passed_year_max != null) {
    searchParams.set("passed_year_max", String(params.passed_year_max));
  }
  if (params?.district?.trim()) {
    searchParams.set("district", params.district.trim());
  }
  if (params?.municipality?.trim()) {
    searchParams.set("municipality", params.municipality.trim());
  }
  if (params?.status) {
    searchParams.set("status", params.status);
  }
  if (params?.certifying_agency) {
    searchParams.set("certifying_agency", params.certifying_agency);
  }
  if (params?.institution_name?.trim()) {
    searchParams.set("institution_name", params.institution_name.trim());
  }

  const qs = searchParams.toString();
  const url = qs ? `/api/graduates/?${qs}` : "/api/graduates/";

  const { data } = await api.get<GraduatesListResponse | GraduateRoster[]>(url);

  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return {
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    results: data?.results ?? [],
  };
}

/**
 * Convenience helper to fetch all graduates for a given institution name.
 * This will follow DRF pagination under the hood and return a flat list.
 */
export async function getAllGraduatesForInstitution(
  institutionName: string,
): Promise<GraduateRoster[]> {
  const trimmed = institutionName.trim();
  if (!trimmed) return [];

  let page: number | null = 1;
  const all: GraduateRoster[] = [];

  while (page != null) {
    const res = await getGraduates({
      page,
      institution_name: trimmed,
    });
    all.push(...(res.results ?? []));
    page = parsePageFromUrl(res.next);
  }

  return all;
}

/** Extract page number from DRF next/previous URL, or null */
export function parsePageFromUrl(url: string | null): number | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const page = u.searchParams.get("page");
    return page ? parseInt(page, 10) : null;
  } catch {
    return null;
  }
}

export async function getGraduate(id: number): Promise<GraduateRoster> {
  const { data } = await api.get<GraduateRoster>(`/api/graduates/${id}/`);
  return data;
}

export async function createGraduate(
  payload: CreateGraduateRosterPayload,
): Promise<GraduateRoster> {
  const { data } = await api.post<GraduateRoster>("/api/graduates/", payload);
  return data;
}

export async function updateGraduate(
  id: number,
  payload: Partial<CreateGraduateRosterPayload>,
): Promise<GraduateRoster> {
  const { data } = await api.patch<GraduateRoster>(
    `/api/graduates/${id}/`,
    payload,
  );
  return data;
}

export async function deleteGraduate(id: number): Promise<void> {
  await api.delete(`/api/graduates/${id}/`);
}
