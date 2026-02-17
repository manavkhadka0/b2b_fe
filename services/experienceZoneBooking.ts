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

export function formatPreferredMonthForOccupancy(
  preferredMonth: string,
): string {
  const [year, month] = preferredMonth.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

export type ExperienceZoneBooking = {
  id: number;
  title: string;
  company_name: string;
  address: string;
  email: string;
  phone: string;
  contact_person: string;
  designation: string | null;
  logo: string | null;
  preferred_month: string;
  description: string;
  type: "Product" | "Service";
  status: string;
  created_at: string;
  updated_at: string;
  subcategory: number | null;
  product: number | null;
};

export type ExperienceZoneBookingListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExperienceZoneBooking[];
};

export type FetchExperienceZoneBookingsOptions = {
  /** Filter by month (1–12). Used by admin only. */
  month?: number;
  /** Filter by year (e.g. 2026). Used by admin only. */
  year?: number;
  /** Page number (1-based) for pagination. */
  page?: number;
};

export async function fetchExperienceZoneBookings(
  options?: FetchExperienceZoneBookingsOptions,
): Promise<ExperienceZoneBookingListResponse> {
  const params = new URLSearchParams();
  if (options?.month != null && options.month >= 1 && options.month <= 12) {
    params.set("month", String(options.month));
  }
  if (options?.year != null) {
    params.set("year", String(options.year));
  }
  if (options?.page != null && options.page > 1) {
    params.set("page", String(options.page));
  }
  const query = params.toString();
  const url = query
    ? `${API_BASE}/api/bookings/?${query}`
    : `${API_BASE}/api/bookings/`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return res.json();
}

export async function getExperienceZoneBooking(
  id: number,
): Promise<ExperienceZoneBooking> {
  const res = await fetch(`${API_BASE}/api/bookings/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "Failed to fetch booking");
  }

  return res.json();
}

export type ExperienceZoneBookingUpdatePayload =
  Partial<ExperienceZoneBookingPayload> & {
    status?: string;
  };

export async function updateExperienceZoneBooking(
  id: number,
  payload: ExperienceZoneBookingUpdatePayload,
): Promise<ExperienceZoneBooking> {
  const res = await fetch(`${API_BASE}/api/bookings/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "Failed to update booking");
  }

  return res.json();
}

export async function deleteExperienceZoneBooking(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/bookings/${id}/`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "Failed to delete booking");
  }
}
