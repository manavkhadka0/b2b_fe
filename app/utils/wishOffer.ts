import useSWR from "swr";
import axios from "axios";
import { Wish, Offer } from "@/types/wish";

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
  const { data, error, isLoading } = useSWR<WishResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
    fetcher
  );

  return {
    wishes: data?.results || [],
    isLoading,
    error,
  };
}

// Custom Hook for Offers
export function useOffers() {
  const { data, error, isLoading } = useSWR<OfferResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
    fetcher
  );

  return {
    offers: data?.results || [],
    isLoading,
    error,
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
