import HowToContent from "@/components/sections/howto/howto-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Apply | BiratBazar",
  description:
    "Learn step-by-step how to apply for jobs, events, and other opportunities on BiratBazar platform. Easy guide for users.",
};

export default function HowToPage() {
  return <HowToContent />;
}
