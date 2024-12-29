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

// Fetch Wishes with Match Percentage
export async function getWishes(): Promise<Wish[]> {
  try {
    const response = await axios.get<WishResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
      { headers: { Accept: "application/json" } }
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch wishes:", error);
    return [];
  }
}

// Fetch Offers
export async function getOffers(): Promise<Offer[]> {
  try {
    const response = await axios.get<OfferResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
      { headers: { Accept: "application/json" } }
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return [];
  }
}
