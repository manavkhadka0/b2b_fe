import { z } from "zod";
import { createWishOfferSchema } from "./schemas/create-wish-schemas";

export type CreateWishFormValues = z.infer<typeof createWishOfferSchema>;

export type DesignationOption = {
  value: string;
  label: string;
};

export type ImageUpload = {
  url: string;
  file: File;
};

export interface HSCode {
  id: number;
  hs_code: string;
  description: string;
}

export interface HSCodeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HSCode[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: string;
}

export interface Service {
  id: number;
  name: string;
  image: string | null;
  category: Category | null;
}

export interface ServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface SubCategory {
  id: number;
  name: string;
  example_items: string;
  reference: string;
  image: string | null;
  category: number;
}

export interface SubCategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubCategory[];
}
