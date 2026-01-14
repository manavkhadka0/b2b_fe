export interface Organizer {
  id: number;
  email: string;
  username: string;
  bio: string;
  date_of_birth: string | null;
  phone_number: string;
  address: string;
  designation: string;
  first_name: string;
  last_name: string;
  alternate_no: string;
  avatar: string;
}

export interface EventOrganizer {
  id: number;
  name: string;
  logo: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface Attendee {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
  };
}

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
}

export interface Offer {
  id: number;
  title: string;
  offer_type: string;
  status: string;
  product?: string;
  service?: string;
}
export interface Wish {
  id: number;
  title: string;
  wish_type: string;
  status: string;
  product?: string;
  service?: string;
}

export interface AgendaItem {
  id: number;
  time: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer?: Organizer;
  event_organizer?: EventOrganizer;
  attendees_count: number;
  sponsors: Sponsor[];
  agenda_items: AgendaItem[];
  event_file?: string | null;
  created_at: string;
  updated_at: string;
  thumbnail: string;
  slug: string;
  tags: Tag[];
  wishes?: Wish[]; // Added property
  offers?: Offer[];
  url?: string; // Added property
  contact_person: string;
  contact_number: string;
  status: string;
  is_featured: boolean;
  is_popular: boolean;
}

export interface EventResponse {
  results: Event[];
  count: number;
  next: string | null;
  previous: string | null;
}
