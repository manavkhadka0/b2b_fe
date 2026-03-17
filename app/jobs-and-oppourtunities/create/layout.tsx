import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job | BiratBazar",
  description:
    "Create and publish job listings to find the best talent for your organization on BiratBazar.",
};

export default function CreateJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
