import InternshipView from "@/components/jobs/internship-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internships | BiratBazar",
  description:
    "Explore internship opportunities for students and recent graduates across various sectors in Nepal.",
};

export default function InternshipPage() {
  return <InternshipView />;
}
