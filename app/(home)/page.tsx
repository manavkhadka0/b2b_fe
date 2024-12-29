import { fetchFeaturedEvents } from "@/api-calls/events";
import LandingView from "@/components/sections/landing-page/view/landing-view";

export default async function LandingPage() {
  const featuredEvents = await fetchFeaturedEvents();

  return <LandingView featuredEvents={featuredEvents} />;
}
