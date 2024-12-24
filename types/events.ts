export interface Organizer {
  id: number;
  email: string;
  username: string;
  bio: string;
  date_of_birth: string | null;
  phone_number: string;
  address: string;
  designation: string;
  alternate_no: string;
  avatar: string;
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
  location?: string;
}
export interface Event {
  // Other properties
  sponsors: Sponsor[]; // Ensure this is part of the Event interface
}

export interface Offer {
  id: number;
  title: string;
  offer_type: string;
  status: string;
  product?: string;
  service?: string;
}

export interface Event {
  // Existing properties
  offers?: Offer[]; // Add this line
}
export interface Wish {
  id: number;
  title: string;
  wish_type: string;
  status: string;
  product?: string;
  service?: string;
}

export interface Event {
  // Existing properties
  wishes?: Wish[]; // Add this line
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
  organizer: Organizer;
  attendees_count: number;
  attendees: Attendee[];
  sponsors: Sponsor[];
  agenda_items: AgendaItem[];
  created_at: string;
  updated_at: string;
  thumbnail: string;
  slug: string;
  tags: Tag[];
  wishes?: Wish[]; // Added property
  offers?: Offer[]; // Added property
}

export interface EventResponse {
  results: Event[];
  count: number;
  next: string | null;
  previous: string | null;
}
