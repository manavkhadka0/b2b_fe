import { EventResponse } from "@/types/events";
import axios from "axios";

export async function fetchFeaturedEvents(): Promise<EventResponse> {
  try {
    const response = await axios.get<EventResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/featured-events/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch event data:", error);
    return {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }
}

export async function getEvents(page: string) {
  try {
    const response = await axios.get<EventResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/?page=${
        page ? page : 1
      }`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }
}
