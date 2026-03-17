import ApprenticeshipView from "@/components/jobs/apprenticeship-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apprenticeships | BiratBazar",
  description:
    "Find local apprenticeship opportunities to gain hands-on experience and build your skills in various industries across Nepal.",
};

export default function ApprenticeshipPage() {
  return (
    <>
      <ApprenticeshipView />
    </>
  );
}
