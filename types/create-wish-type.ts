import { z } from "zod";
import { createWishSchema } from "./schemas/create-wish-schemas";

export type CreateWishFormValues = z.infer<typeof createWishSchema>;

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
