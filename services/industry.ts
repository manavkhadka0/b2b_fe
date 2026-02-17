import { api } from "@/lib/api";

export interface Industry {
  id: number;
  name: string;
  logo: string | null;
  file_link: string | null;
  email: string;
  description: string;
  website_link: string;
  slug: string;
}

export interface IndustryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Industry[];
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/industries`;

export async function getIndustriesPaginated(
  page?: number,
  signal?: AbortSignal,
): Promise<IndustryResponse> {
  const params = new URLSearchParams();
  if (page != null && page > 1) params.set("page", String(page));
  const query = params.toString();
  const url = `${BASE_URL}/${query ? `?${query}` : ""}`;
  const response = await api.get<IndustryResponse>(url, { signal });
  return response.data;
}

export async function getIndustryById(id: number): Promise<Industry> {
  const response = await api.get<Industry>(`${BASE_URL}/${id}/`);
  return response.data;
}

export interface CreateIndustryPayload {
  name: string;
  email?: string;
  description?: string;
  website_link?: string;
  file_link?: string;
  logo?: File | null;
}

export async function createIndustry(
  data: CreateIndustryPayload,
): Promise<Industry> {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.description) formData.append("description", data.description);
  if (data.website_link) formData.append("website_link", data.website_link);
  if (data.file_link) formData.append("file_link", data.file_link);
  if (data.logo) formData.append("logo", data.logo);

  const response = await api.post<Industry>(BASE_URL + "/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export interface UpdateIndustryPayload {
  name?: string;
  email?: string;
  description?: string;
  website_link?: string;
  file_link?: string;
  logo?: File | null;
}

export async function updateIndustry(
  id: number,
  data: UpdateIndustryPayload,
): Promise<Industry> {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.website_link !== undefined)
    formData.append("website_link", data.website_link);
  if (data.file_link !== undefined) formData.append("file_link", data.file_link);
  if (data.logo) formData.append("logo", data.logo);

  const response = await api.patch<Industry>(`${BASE_URL}/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteIndustry(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}/`);
}
