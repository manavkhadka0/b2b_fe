export interface LogoItem {
  id: number;
  name: string;
  url: string;
}

export interface CompanyLogo {
  id: number;
  name: string;
  slug: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyLogoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompanyLogo[];
}

