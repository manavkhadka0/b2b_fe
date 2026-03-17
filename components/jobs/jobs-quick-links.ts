import type { LucideIcon } from "lucide-react";
import { Briefcase, GraduationCap, List } from "lucide-react";

export const JOBS_QUICK_LINKS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/jobs-and-oppourtunities/career-guidance",
    label: "Career Guidance",
    icon: Briefcase,
  },
  {
    href: "/jobs-and-oppourtunities/internship",
    label: "Internship Opportunities",
    icon: GraduationCap,
  },
  {
    href: "/jobs-and-oppourtunities/apprenticeship",
    label: "Apprenticeship Opportunities",
    icon: GraduationCap,
  },
  {
    href: "/jobs-and-oppourtunities/roster",
    label: "Skilled Workforce Roster",
    icon: List,
  },
];
