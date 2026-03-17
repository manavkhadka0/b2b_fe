import EmployerView from "@/components/jobs/EmployerView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Dashboard | BiratBazar",
  description:
    "Manage your job listings, track applications, and find the right candidates for your business.",
};

export default function EmployerPage() {
  return <EmployerView />;
}
