export const STATUS_COLORS = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
} as const;

export const ALL_OPTION = "all";

export const API_BASE_URL = "https://cim.baliyoventures.com";

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  return data.results || [];
};
