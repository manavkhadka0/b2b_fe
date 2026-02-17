import { api } from "@/lib/api";

export interface Contact {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ContactResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export async function getContactsPaginated(
  page?: number,
): Promise<ContactResponse> {
  const params = new URLSearchParams();
  if (page != null && page > 1) params.set("page", String(page));
  const query = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${query ? `?${query}` : ""}`;
  const response = await api.get<ContactResponse>(url);
  return response.data;
}
