import CareerGuidanceView from "@/components/jobs/career-guidance-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Guidance | BiratBazar",
  description:
    "Professional career guidance and resources to help you make informed decisions about your professional future in Nepal.",
};

export default function CareerGuidancePage() {
  return (
    <>
      <CareerGuidanceView />
    </>
  );
}
