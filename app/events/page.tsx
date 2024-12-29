import React from "react";
import axios from "axios";

// Import types
import { EventResponse } from "@/types/events";
import { EventsListView } from "@/components/sections/events/view/events-list-view";

async function getEvents(page: string) {
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

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const eventsResponse = await getEvents(searchParams.page);

  return <EventsListView eventsResponse={eventsResponse} />;
}
