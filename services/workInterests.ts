import { api } from "@/lib/api";
import { UnitGroup } from "@/types/unit-groups";
import { Location } from "@/types/auth";

export type ProficiencyLevel = "Beginner" | "Intermediate" | "Expert";

export type AvailabilityOption =
  | "Full Time"
  | "Part Time"
  | "Internship"
  | "Freelance";

export interface WorkInterestSkill {
  id: number;
  name: string;
}

export interface WorkInterest {
  id: number;
  user?: number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  unit_group: UnitGroup;
  title: string;
  summary?: string;
  skills: WorkInterestSkill[];
  proficiency_level: ProficiencyLevel;
  availability: AvailabilityOption;
  preferred_locations: Location[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkInterestsApiResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: WorkInterest[];
}

export interface WorkInterestFilters {
  search?: string;
  availability?: AvailabilityOption;
  proficiency_level?: ProficiencyLevel;
  unit_group?: string;
}

export interface CreateWorkInterestPayload {
  name?: string;
  email?: string;
  phone?: string;
  unit_group: number;
  title: string;
  summary?: string;
  skills?: Array<number | string>;
  proficiency_level: ProficiencyLevel;
  availability: AvailabilityOption;
  preferred_locations?: number[];
}

export interface HireWorkInterestPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function normalizeResponse(
  data: WorkInterestsApiResponse | WorkInterest[],
): WorkInterest[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
}

export async function getWorkInterests(
  filters?: WorkInterestFilters,
): Promise<WorkInterest[]> {
  const params = new URLSearchParams();

  if (filters?.search?.trim()) params.append("search", filters.search.trim());
  if (filters?.availability)
    params.append("availability", filters.availability);
  if (filters?.proficiency_level)
    params.append("proficiency_level", filters.proficiency_level);
  if (filters?.unit_group) params.append("unit_group", filters.unit_group);

  const query = params.toString();
  const url = `/api/work-interests/${query ? `?${query}` : ""}`;

  const response = await api.get<WorkInterestsApiResponse | WorkInterest[]>(
    url,
  );
  return normalizeResponse(response.data);
}

export async function createWorkInterest(
  payload: CreateWorkInterestPayload,
): Promise<WorkInterest> {
  const { data } = await api.post<WorkInterest>(
    "/api/work-interests/",
    payload,
  );
  return data;
}

export async function hireWorkInterest(
  id: number,
  payload: HireWorkInterestPayload,
): Promise<void> {
  await api.post(`/api/work-interests/${id}/hire/`, payload);
}

export async function getSkills(search?: string): Promise<WorkInterestSkill[]> {
  try {
    const params = new URLSearchParams();
    if (search?.trim()) params.append("search", search.trim());
    const query = params.toString();
    const { data } = await api.get<{ results?: WorkInterestSkill[] }>(
      `/api/skills/${query ? `?${query}` : ""}`,
    );
    if (Array.isArray(data)) return data as WorkInterestSkill[];
    return data?.results ?? [];
  } catch (error) {
    console.warn(
      "Failed to fetch skills, continuing without suggestions:",
      error,
    );
    return [];
  }
}

export async function createSkill(name: string): Promise<WorkInterestSkill> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Skill name required");
  }
  const { data } = await api.post<WorkInterestSkill>("/api/skills/", {
    name: trimmed,
  });
  return data;
}
