import useSWR from "swr";
import axios from "axios";
import { Wish, Offer, WishAndOffer } from "@/types/wish";

// API Response Types
type WishResponse = {
  results: Wish[];
  count: number;
  next: string | null;
  previous: string | null;
};

type OfferResponse = {
  results: Offer[];
  count: number;
  next: string | null;
  previous: string | null;
};

// Axios Fetcher for SWR
const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: { Accept: "application/json" },
    })
    .then((res) => res.data);

// Custom Hook for Wishes
export function useWishes() {
  const { data, error, isLoading, mutate } = useSWR<WishResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
    fetcher
  );

  return {
    wishes: data?.results || [],
    isLoading,
    mutate,
    error,
  };
}

// Custom Hook for Offers
export function useOffers() {
  const { data, error, isLoading, mutate } = useSWR<OfferResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
    fetcher
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
