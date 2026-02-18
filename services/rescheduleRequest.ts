import { api } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export type RescheduleRequest = {
  id: number;
  booking: number;
  new_booking_date: string | null;
  new_start_time: string | null;
  new_end_time: string | null;
  new_room_category: string | null;
  new_booking_type: string | null;
  reason: string | null;
  status: "Pending" | "Approved" | "Rejected";
  created_at?: string;
  updated_at?: string;
};

export type RescheduleRequestPayload = {
  booking: number;
  new_booking_date?: string | null;
  new_start_time?: string | null;
  new_end_time?: string | null;
  new_room_category?: string | null;
  new_booking_type?: string | null;
  reason?: string | null;
};

export async function createRescheduleRequest(
  payload: RescheduleRequestPayload,
  token?: string | null
): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE}/api/reschedule-request/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.detail || err.message || "Failed to submit reschedule request"
    );
  }

  return res.json();
}

export interface RescheduleRequestListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RescheduleRequest[];
}

export async function getRescheduleRequests(
  bookingId: number
): Promise<RescheduleRequest[]> {
  const response = await api.get<RescheduleRequestListResponse>(
    `/api/reschedule-request/?booking=${bookingId}`
  );
  return response.data.results ?? [];
}

export async function updateRescheduleRequest(
  id: number,
  payload: { status: "Approved" | "Rejected" }
): Promise<RescheduleRequest> {
  const response = await api.patch<RescheduleRequest>(
    `/api/reschedule-request/${id}/`,
    payload
  );
  return response.data;
}
