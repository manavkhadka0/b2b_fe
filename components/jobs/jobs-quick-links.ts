import type { LucideIcon } from "lucide-react";
import { Briefcase, GraduationCap, List } from "lucide-react";

export const JOBS_QUICK_LINKS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/jobs/career-guidance",
    label: "Career Guidance",
    icon: Briefcase,
  },
  {
    href: "/jobs/internship",
    label: "Internship Opportunities",
    icon: GraduationCap,
  },
  {
    href: "/jobs/apprenticeship",
    label: "Apprenticeship Opportunities",
    icon: GraduationCap,
  },
  {
    href: "/jobs/roster",
    label: "Skilled Workforce Roster",
    icon: List,
  },
];
