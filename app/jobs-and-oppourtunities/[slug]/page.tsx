import { getJobBySlug } from "@/services/jobs";
import JobDetailClient from "./JobDetailClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const job = await getJobBySlug(params.slug);

    if (!job) {
      return {
        title: "Job Not Found | BiratBazar",
      };
    }

    const companyName =
      job.company_name || job.company?.name || "Company";

    return {
      title: `${job.title} at ${companyName} | BiratBazar`,
      description:
        job.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
        `Apply for ${job.title} position at ${companyName} on BiratBazar.`,
    };
  } catch (error) {
    return {
      title: "Job Details | BiratBazar",
    };
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  let initialJob = null;

  try {
    initialJob = await getJobBySlug(slug);
  } catch (error) {
    console.error("Error pre-fetching job:", error);
  }

  return <JobDetailClient initialJob={initialJob} slug={slug} />;
}
