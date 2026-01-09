import { Event, EventResponse } from "@/types/events";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getEvents(page: string = "1"): Promise<EventResponse> {
  try {
    const response = await axios.get<EventResponse>(
      `${API_BASE}/api/events/events/?page=${page ? page : 1}`,
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

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const response = await axios.get<Event>(
      `${API_BASE}/api/events/events/${slug}/`,
      { headers: { Accept: "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch event with slug ${slug}:`, error);
    return null;
  }
}

export async function createEvent(formData: FormData): Promise<Event> {
  try {
    const response = await axios.post<Event>(
      `${API_BASE}/api/events/events/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
}

export async function updateEvent(
  slug: string,
  formData: FormData
): Promise<Event> {
  try {
    const response = await axios.patch<Event>(
      `${API_BASE}/api/events/events/${slug}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update event with slug ${slug}:`, error);
    throw error;
  }
}
