import useSWR from "swr";
import axios from "axios";
import { Wish, Offer, WishAndOffer } from "@/types/wish";
import { CategoryResponse } from "@/types/create-wish-type";

import useSWRInfinite from "swr/infinite";

// API Response Types
type PaginatedResponse<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

type WishResponse = PaginatedResponse<Wish>;
type OfferResponse = PaginatedResponse<Offer>;

// Combined API returns items with model_type to distinguish wish vs offer
type CombinedItem = (Wish | Offer) & { model_type: "wish" | "offer" };
type CombinedResponse = PaginatedResponse<CombinedItem>;

// Axios Fetcher for SWR (public, no auth)
const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: { Accept: "application/json" },
    })
    .then((res) => res.data);

// Axios Fetcher for SWR with auth token (profile, "my" data)
const authFetcher = (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return axios
    .get(url, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    .then((res) => res.data);
};

// Helper to get key for SWR Infinite
const getGetKey =
  (
    baseUrl: string,
    categoryId?: number | null,
    subcategoryId?: number | null,
    eventSlug?: string | null
  ) =>
  (pageIndex: number, previousPageData: PaginatedResponse<any> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.next) return null;

    // First page
    if (pageIndex === 0) {
      const params = new URLSearchParams();
      if (subcategoryId) {
        params.append("subcategory_id", subcategoryId.toString());
      } else if (categoryId) {
        params.append("category_id", categoryId.toString());
      }
      if (eventSlug) {
        params.append("event_slug", eventSlug);
      }
      const queryString = params.toString();
      return queryString ? `${baseUrl}?${queryString}` : `${baseUrl}`;
    }

    // Add cursor/pagination query to next pages
    // The API returns the full URL in `next`, so use that if available,
    // or manually construct if offset/limit is needed (API usually gives full next URL).
    // Fix: Reconstruct URL to avoid CORS/Protocol issues (e.g. http vs https)
    // We trust our configured baseUrl and just want the pagination params from 'next'
    if (previousPageData?.next) {
      try {
        const nextUrl = new URL(previousPageData.next);
        return `${baseUrl}${nextUrl.search}`;
      } catch (e) {
        // Fallback if next is not a valid URL
        return previousPageData.next;
      }
    }

    return null;
  };

// Helper for combined API - includes model_type filter
const getGetKeyCombined =
  (
    baseUrl: string,
    categoryId?: number | null,
    subcategoryId?: number | null,
    eventSlug?: string | null,
    modelType?: "wish" | "offer" | null
  ) =>
  (pageIndex: number, previousPageData: PaginatedResponse<any> | null) => {
    if (previousPageData && !previousPageData.next) return null;

    if (pageIndex === 0) {
      const params = new URLSearchParams();
      if (subcategoryId) {
        params.append("subcategory_id", subcategoryId.toString());
      } else if (categoryId) {
        params.append("category_id", categoryId.toString());
      }
      if (eventSlug) {
        params.append("event_slug", eventSlug);
      }
      if (modelType) {
        params.append("model_type", modelType);
      }
      const queryString = params.toString();
      return queryString ? `${baseUrl}?${queryString}` : `${baseUrl}`;
    }

    if (previousPageData?.next) {
      try {
        const nextUrl = new URL(previousPageData.next);
        const params = new URLSearchParams(nextUrl.search);
        if (modelType) {
          params.set("model_type", modelType);
        }
        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      } catch (e) {
        return previousPageData.next;
      }
    }

    return null;
  };

// Custom Hook for Wishes (Infinite)
export function useWishes(
  categoryId?: number | null,
  subcategoryId?: number | null,
  eventSlug?: string | null
) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`;

  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<WishResponse>(
      getGetKey(baseUrl, categoryId, subcategoryId, eventSlug),
      fetcher,
      {
        revalidateFirstPage: false,
      }
    );

  // Flatten results
  const wishes = data ? data.flatMap((page) => page.results) : [];
  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.next);

  return {
    wishes,
    isLoading, // Initial loading
    isLoadingMore:
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    isReachingEnd,
    mutate,
    error,
    size,
    setSize,
  };
}

// Custom Hook for Offers (Infinite)
export function useOffers(
  categoryId?: number | null,
  subcategoryId?: number | null,
  eventSlug?: string | null
) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`;

  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<OfferResponse>(
      getGetKey(baseUrl, categoryId, subcategoryId, eventSlug),
      fetcher,
      {
        revalidateFirstPage: false,
      }
    );

  const offers = data ? data.flatMap((page) => page.results) : [];
  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.next);

  return {
    offers,
    isLoading,
    isLoadingMore:
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    isReachingEnd,
    error,
    mutate,
    size,
    setSize,
  };
}

// Combined hook for Wishes & Offers (single API call)
export function useCombinedWishesOffers(
  categoryId?: number | null,
  subcategoryId?: number | null,
  eventSlug?: string | null,
  modelType?: "wish" | "offer" | null
) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/combined/`;

  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<CombinedResponse>(
      getGetKeyCombined(baseUrl, categoryId, subcategoryId, eventSlug, modelType),
      fetcher,
      {
        revalidateFirstPage: false,
      }
    );

  // Flatten - preserve API order (allResults); split for backwards compatibility
  const allResults = data ? data.flatMap((page) => page.results) : [];
  const wishes = allResults.filter(
    (r): r is CombinedItem & Wish => r.model_type === "wish"
  ) as Wish[];
  const offers = allResults.filter(
    (r): r is CombinedItem & Offer => r.model_type === "offer"
  ) as Offer[];

  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.next);

  return {
    allResults, // Original API order
    wishes,
    offers,
    isLoading,
    isLoadingMore:
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    isReachingEnd,
    mutate,
    error,
    size,
    setSize,
  };
}

// Shared hook for Wish & Offer categories (reduces duplicate category API calls)
export function useWishOfferCategories() {
  const productUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Product`;
  const serviceUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Service`;

  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
  } = useSWR<CategoryResponse>(productUrl, fetcher);

  const {
    data: serviceData,
    error: serviceError,
    isLoading: serviceLoading,
  } = useSWR<CategoryResponse>(serviceUrl, fetcher);

  return {
    productCategories: productData?.results || [],
    serviceCategories: serviceData?.results || [],
    isLoading: productLoading || serviceLoading,
    error: productError || serviceError,
  };
}

// Authenticated hooks for "My" wishes and offers (used in profile)
// Keeping these as single page for now unless requested, but reusing authFetcher
export function useMyWishes() {
  const { data, error, isLoading, mutate } = useSWR<WishResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
    authFetcher
  );

  return {
    wishes: data?.results || [],
    isLoading,
    error,
    mutate,
  };
}

export function useMyOffers() {
  const { data, error, isLoading, mutate } = useSWR<OfferResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
    authFetcher
  );

  return {
    offers: data?.results || [],
    isLoading,
    error,
    mutate,
  };
}

export function useWishAndOffer() {
  const { data, isLoading, error, mutate } = useSWR<WishAndOffer>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wish-offers/`,
    fetcher
  );
  return {
    wish_and_offers: data,
    isLoading,
    error,
    mutate,
  };
}

// Add this function alongside existing code
export async function getWishes() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
    { headers: { Accept: "application/json" } }
  );
  const data = await response.json();
  return data.results || [];
}

export async function searchWishesOffers(search: string): Promise<{
  wishes: Wish[];
  offers: Offer[];
}> {
  try {
    // Call both APIs in parallel
    const [wishesResponse, offersResponse] = await Promise.all([
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/wish_and_offers/wishes/?search=${encodeURIComponent(search)}`,
        { headers: { Accept: "application/json" } }
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/wish_and_offers/offers/?search=${encodeURIComponent(search)}`,
        { headers: { Accept: "application/json" } }
      ),
    ]);

    const wishesData = await wishesResponse.json();
    const offersData = await offersResponse.json();

    return {
      wishes: wishesData.results || [],
      offers: offersData.results || [],
    };
  } catch (error) {
    console.error("Error searching wishes and offers:", error);
    return { wishes: [], offers: [] };
  }
}

type SearchResult = {
  wishes: Wish[];
  offers: Offer[];
};

// SWR hook for searching wishes and offers (dedupes repeated search calls)
export function useSearchWishesOffers(search: string) {
  const trimmed = search.trim();
  const shouldFetch = trimmed.length > 0;

  const { data, error, isLoading } = useSWR<SearchResult>(
    shouldFetch ? ["searchWishesOffers", trimmed] : null,
    // SWR fetcher delegates to the existing search function (which calls both APIs in parallel)
    ([, query]) => searchWishesOffers(query as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    results: data ?? null,
    isLoading,
    error,
  };
}

// Custom Hook for Event-specific Wishes
export function useEventWishes(eventSlug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<WishResponse>(
    eventSlug
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/events/${eventSlug}/wishes/`
      : null,
    fetcher
  );

  return {
    wishes: data?.results || [],
    isLoading,
    mutate,
    error,
  };
}

// Custom Hook for Event-specific Offers
export function useEventOffers(eventSlug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<OfferResponse>(
    eventSlug
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/events/${eventSlug}/offers/`
      : null,
    fetcher
  );

  return {
    offers: data?.results || [],
    isLoading,
    mutate,
    error,
  };
}
