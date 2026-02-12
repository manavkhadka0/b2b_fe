const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export type ExperienceZoneBookingPayload = {
  title?: string;
  company_name: string;
  address: string;
  email: string;
  phone: string;
  contact_person: string;
  designation?: string | null;
  subcategory?: number | null;
  preferred_month: string;
  description: string;
  product?: number | null;
  type: "Product" | "Service";
};

export async function createExperienceZoneBooking(
  payload: ExperienceZoneBookingPayload,
  token?: string | null,
): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE}/api/bookings/`, {
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
