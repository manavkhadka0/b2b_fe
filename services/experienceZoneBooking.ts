const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export type OccupancyItem = {
  month: string;
  occupied_seats: number;
  remaining_seats: number;
  waitlisted_count: number;
  is_full: boolean;
};

export async function fetchOccupancy(): Promise<OccupancyItem[]> {
  const res = await fetch(`${API_BASE}/api/occupancy/`);
  if (!res.ok) {
    throw new Error("Failed to fetch occupancy");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function formatPreferredMonthForOccupancy(preferredMonth: string): string {
  const [year, month] = preferredMonth.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthName = monthNames[parseInt(month || "01", 10) - 1];
  return `${monthName} ${year}`;
}

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
