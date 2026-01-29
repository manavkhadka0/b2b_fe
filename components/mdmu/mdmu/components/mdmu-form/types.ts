import { z } from "zod";
import { mdmuFormSchema } from "./schemas";

export type MDMUFormData = z.infer<typeof mdmuFormSchema>;

export interface MDMUResponse extends MDMUFormData {
  id: number;
  nature_of_industry_sub_category_detail: IndustrySubCategory;
  status: "Pending" | "Approved" | "Rejected";
  file_url: string | null;
}

export interface IndustryCategory {
  id: number;
  name: string;
}

export type IndustrySize =
  | "Startup"
  | "Micro"
  | "Cottage"
  | "Small"
  | "Medium"
  | "Large";

export interface IndustrySubCategory {
  id: number;
  name: string;
  category: IndustryCategory;
}

export type FormStep = {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
};

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type MDMUResponsePaginated = PaginatedResponse<MDMUResponse>;
