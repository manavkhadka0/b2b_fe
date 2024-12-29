import { Tag } from "./events";

export interface BDSServiceCategory {
  id: number;
  name: string;
  description: string;
}

export interface BDSService {
  id: number;
  category: BDSServiceCategory;
  tags: Tag[];
  Company_name: string;
  finance_services: string | null;
  service: string;
  description: string;
  address: string;
  logo: string | null;
}

export interface BDSServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BDSService[];
}

export interface BDSServiceCategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BDSServiceCategory[];
}
