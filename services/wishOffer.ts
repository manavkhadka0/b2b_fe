import axios from "axios";
import { Wish, Offer } from "@/types/wish";

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

export async function getAllWishes(): Promise<Wish[]> {
  const response = await axios.get<WishResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
    {
      headers: { Accept: "application/json" },
    }
  );
  return response.data.results || [];
}

export async function getAllOffers(): Promise<Offer[]> {
  const response = await axios.get<OfferResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/`,
    {
      headers: { Accept: "application/json" },
    }
  );
  return response.data.results || [];
}

export async function deleteWish(id: number): Promise<void> {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/${id}/`,
    {
      headers: { Accept: "application/json" },
    }
  );
}

export async function deleteOffer(id: number): Promise<void> {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/${id}/`,
    {
      headers: { Accept: "application/json" },
    }
  );
}
