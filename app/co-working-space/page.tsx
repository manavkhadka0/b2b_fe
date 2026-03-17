import CoWorkingSpaceView from "@/components/sections/co-working-space/co-working-space-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Co-working Space | BiratBazar",
  description:
    "Book modern, flexible, and fully equipped co-working spaces in Nepal. Ideal for entrepreneurs, freelancers, and small businesses.",
  keywords: ["Co-working", "Office Space", "Nepal", "Startup", "BiratBazar"],
};

export default function CoWorkingSpacePage() {
  return <CoWorkingSpaceView />;
}
