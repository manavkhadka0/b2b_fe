export const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
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
