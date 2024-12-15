"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DefaultNav } from "./default-nav";
import { JobSeekerNav } from "./jobseeker-nav";
import { EmployerNav } from "./employer-nav";
import { DefaultNavSkeleton } from "./default-nav-skeleton";

export function NavWrapper() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <DefaultNavSkeleton />;

  if (!user) {
    return <DefaultNav />;
  }

  if (user.user_type === "Job Seeker") {
    return <JobSeekerNav />;
  }

  if (user.user_type === "Employer") {
    return <EmployerNav />;
  }

  return <DefaultNav />;
}
