import { UnitGroup } from "./unit-groups";
import { Location } from "./auth";

export interface Job {
  id: number;
  slug: string;
  title: string;
  company_name?: string | null;
  email_to?: string | null;
  unit_group: UnitGroup;
  required_skill_level: string;
  required_education: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  show_salary: boolean;
  salary_range_min?: string;
  salary_range_max?: string;
  location: Location[];
  deadline: string;
  employment_type: string;
}
