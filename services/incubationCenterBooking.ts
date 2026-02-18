const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
