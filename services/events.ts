import { Event, EventResponse, EventOrganizer, Tag } from "@/types/events";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getEvents(page: string = "1"): Promise<EventResponse> {
  try {
    const response = await axios.get<EventResponse>(
      `${API_BASE}/api/events/events/?page=${page ? page : 1}&is_active=true`,
      {
        headers: {
          Accept: "application/json",
        },
      },
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
export async function getAdminEvents(
  page: string = "1",
): Promise<EventResponse> {
  try {
    const response = await axios.get<EventResponse>(
      `${API_BASE}/api/events/events/?page=${page ? page : 1}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
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
      { headers: { Accept: "application/json" } },
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
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
}

export async function updateEvent(
  slug: string,
  formData: FormData,
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
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update event with slug ${slug}:`, error);
    throw error;
  }
}

export async function deleteEvent(slug: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE}/api/events/events/${slug}/`, {
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error(`Failed to delete event with slug ${slug}:`, error);
    throw error;
  }
}

export async function addEventImages(
  eventId: number,
  images: File[],
): Promise<unknown> {
  try {
    const formData = new FormData();
    formData.append("event", String(eventId));
    images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post(
      `${API_BASE}/api/events/event-images/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to add images for event ${eventId}:`, error);
    throw error;
  }
}

export async function deleteEventImage(imageId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE}/api/events/event-images/${imageId}/`, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to delete event image ${imageId}:`, error);
    throw error;
  }
}

export async function getEventOrganizers(): Promise<EventOrganizer[]> {
  try {
    const response = await axios.get<{ results: EventOrganizer[] }>(
      `${API_BASE}/api/events/event-organizers/`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch event organizers:", error);
    return [];
  }
}

export async function createEventOrganizer(
  formData: FormData,
): Promise<EventOrganizer> {
  try {
    const response = await axios.post<EventOrganizer>(
      `${API_BASE}/api/events/event-organizers/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create event organizer:", error);
    throw error;
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const response = await axios.get<{ results: Tag[] }>(
      `${API_BASE}/api/events/tags/`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

export async function getPastEvents(
  page: string = "1",
): Promise<EventResponse> {
  try {
    const response = await axios.get<EventResponse>(
      `${API_BASE}/api/events/past-events/?page=${page ? page : 1}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch past events:", error);
    return {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }
}
