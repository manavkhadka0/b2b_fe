/**
 * Graduate Roster API – /api/graduates/ (paginated) and /api/graduates/<id>/
 */

import { api } from "@/lib/api";
import type {
  GraduateRoster,
  CreateGraduateRosterPayload,
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
}

export async function getGraduates(
  params?: GetGraduatesParams,
): Promise<GraduatesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());

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
