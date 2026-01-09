export type Wish = {
  id: number;
  full_name: string;
  designation: string;
  mobile_no: string;
  alternate_no?: string | null;
  email: string;
  company_name: string;
  address: string;
  country: string;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  company_website?: string | null;
  image?: string | null;
  title: string;
  description?: string | null;
  event: number;
  product?: {
    id: number;
    name?: string;
    hs_code?: string;
    description?: string;
    image?: string | null;
    category?: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  } | null;
  service?: {
    id: number;
    name: string;
    description: string;
  };
  status: string;
  type: string;
  match_percentage: number; // Reflects `match_percentage` from API
  created_at: string;
  updated_at: string;
  offers: Offer[];
};

export type Offer = {
  id: number;
  full_name?: string;
  designation?: string;
  mobile_no?: string;
  alternate_no?: string | null;
  email?: string;
  company_name?: string;
  address?: string;
  country?: string;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  company_website?: string | null;
  image?: string | null;
  title: string;
  description?: string | null;
  product?: {
    id?: number;
    name?: string;
    hs_code?: string;
    description?: string;
    image?: string | null;
    category?: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  } | null;
  service?: {
    id?: number;
    name?: string;
    description?: string;
    category?: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  } | null;
  type: string;
  status: string;
  match_percentage?: number; // Added to handle high match filtering
  created_at: string;
  updated_at: string;
  wishes?: Wish[];
};

export type WishAndOffer = {
  wishes: Wish[];
  offers: Offer[];
};
