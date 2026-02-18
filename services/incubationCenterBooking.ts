import { api } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export type IncubationCenterBooking = {
  id: number;
  has_pending_reschedule_request: boolean;
  booking_type: "Co-working Seat" | "Private Room";
  full_name: string;
  email: string;
  phone: string;
  address: string;
  name: string;
  founder_name: string | null;
  founder_designation: string | null;
  purpose: string;
  no_of_seats: number | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  room_category: string | null;
  no_of_participants: number | null;
  wifi: boolean;
  photocopy: boolean;
  printing: boolean;
  interactive_board: boolean;
  whiteboard_marker: boolean;
  tea_coffee_water: boolean;
  other_service: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type IncubationCenterBookingPayload = {
  booking_type: "Co-working Seat" | "Private Room";
  full_name: string;
  email: string;
  phone: string;
  address: string;
  name: string;
  founder_name?: string | null;
  founder_designation?: string | null;
  purpose: string;
  no_of_seats?: number | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  room_category?: string | null;
  no_of_participants?: number | null;
  wifi: boolean;
  photocopy: boolean;
  printing: boolean;
  interactive_board: boolean;
  whiteboard_marker: boolean;
  tea_coffee_water: boolean;
  other_service?: string | null;
};

export async function createIncubationCenterBooking(
  payload: IncubationCenterBookingPayload,
  token?: string | null,
): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE}/api/incubation-center/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "Failed to submit booking");
  }

  return res.json();
}

export type IncubationCenterBookingUpdatePayload = Partial<
  Omit<IncubationCenterBookingPayload, "booking_type">
> & {
  is_approved?: boolean;
};

export interface IncubationCenterBookingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IncubationCenterBooking[];
}

export async function getIncubationCenterBookings(
  page?: number
): Promise<IncubationCenterBookingListResponse> {
  const params = new URLSearchParams();
  if (page != null && page > 1) params.set("page", String(page));
  const query = params.toString();
  const url = `/api/incubation-center/${query ? `?${query}` : ""}`;
  const response = await api.get<IncubationCenterBookingListResponse>(url);
  return response.data;
}

export async function getIncubationCenterBookingById(
  id: number
): Promise<IncubationCenterBooking> {
  const response = await api.get<IncubationCenterBooking>(
    `/api/incubation-center/${id}/`
  );
  return response.data;
}

export async function updateIncubationCenterBooking(
  id: number,
  payload: IncubationCenterBookingUpdatePayload
): Promise<IncubationCenterBooking> {
  const response = await api.patch<IncubationCenterBooking>(
    `/api/incubation-center/${id}/`,
    payload
  );
  return response.data;
}

export async function deleteIncubationCenterBooking(
  id: number
): Promise<void> {
  await api.delete(`/api/incubation-center/${id}/`);
}
