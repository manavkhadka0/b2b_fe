export type Wish = {
  id: number;
  title: string;
  product?: {
    name: string;
    description: string;
    hs_code?: string;
  };
  service?: {
    name: string;
    description: string;
  };
  hCode?: string;
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
