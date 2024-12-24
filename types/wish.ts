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
  event: number;
  product?: {
    id: number;
    name: string;
    hs_code: string;
    description: string;
    image?: string | null;
    category: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  };
  service?: {
    id: number;
    name: string;
    description: string;
  };
  status: string;
  wish_type: string;
  match_percentage: number; // Reflects `match_percentage` from API
  created_at: string;
  updated_at: string;
};





export type Offer = {
  id: number;
  
  title: string;
  product?: {
    name: string;
    description: string;
    hs_code?: string;
    category?: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  };
  service?: {
    name: string;
    description: string;
    category?: {
      id: number;
      name: string;
      description: string;
      image?: string | null;
    };
  };
  offer_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};
