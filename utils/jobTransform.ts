import { Job, JobApiResponse, JobApplication } from "@/types/types";

export const transformJobs = (apiJobs: JobApiResponse[]): Job[] => {
  return apiJobs.map((apiJob) => {
    // Get company name from company_name or user's name
    const company =
      apiJob.company_name ||
      `${apiJob.user.first_name} ${apiJob.user.last_name}`.trim() ||
      apiJob.user.username;

    // Get location from location array
    const location =
      apiJob.location.length > 0
        ? apiJob.location.map((loc) => loc.name).join(", ")
        : "Not specified";

    // Format salary range
    const salaryRange =
      apiJob.show_salary && apiJob.salary_range_min && apiJob.salary_range_max
        ? `NRs. ${parseFloat(
            apiJob.salary_range_min
          ).toLocaleString()} - ${parseFloat(
            apiJob.salary_range_max
          ).toLocaleString()}`
        : "Not disclosed";

    // Map employment_type to JobType
    const mapEmploymentType = (type: string): Job["type"] => {
      const typeMap: Record<string, Job["type"]> = {
        "Full Time": "Full-time",
        "Part Time": "Part-time",
        Contract: "Contract",
        Freelance: "Freelance",
      };
      return typeMap[type] || "Full-time";
    };

    // Format posted date
    const formatPostedDate = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
      }
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    };

    return {
      id: apiJob.id.toString(),
      slug: apiJob.slug,
      title: apiJob.title,
      company,
      location,
      salaryRange,
      type: mapEmploymentType(apiJob.employment_type),
      postedDate: formatPostedDate(apiJob.posted_date),
      requirements: [], // API doesn't provide requirements, using empty array
      isApplied: apiJob.is_applied || false,
    };
  });
};

export const transformAppliedJobs = (applications: JobApplication[]): Job[] => {
  return applications.map((application) => {
    const apiJob = application.job;
    
    // Get company name from company_name or user's name
    const company =
      apiJob.company_name ||
      `${apiJob.user.first_name} ${apiJob.user.last_name}`.trim() ||
      apiJob.user.username;

    // Get location from location array
    const location =
      apiJob.location.length > 0
        ? apiJob.location.map((loc) => loc.name).join(", ")
        : "Not specified";

    // Format salary range
    const salaryRange =
      apiJob.show_salary && apiJob.salary_range_min && apiJob.salary_range_max
        ? `NRs. ${parseFloat(
            apiJob.salary_range_min
          ).toLocaleString()} - ${parseFloat(
            apiJob.salary_range_max
          ).toLocaleString()}`
        : "Not disclosed";

    // Map employment_type to JobType
    const mapEmploymentType = (type: string): Job["type"] => {
      const typeMap: Record<string, Job["type"]> = {
        "Full Time": "Full-time",
        "Part Time": "Part-time",
        Contract: "Contract",
        Freelance: "Freelance",
      };
      return typeMap[type] || "Full-time";
    };

    // Format posted date
    const formatPostedDate = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
      }
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    };

    return {
      id: apiJob.id.toString(),
      slug: apiJob.slug,
      title: apiJob.title,
      company,
      location,
      salaryRange,
      type: mapEmploymentType(apiJob.employment_type),
      postedDate: formatPostedDate(apiJob.posted_date),
      requirements: [], // API doesn't provide requirements, using empty array
      isApplied: true, // Always true for applied jobs
    };
  });
};
