export interface Tag {
  name: string;
}

export interface Attendee {
  name: string;
  image: string;
}

export interface Organizer {
  id: number;
  email: string;
  username: string;
  bio: string;
  date_of_birth: string | null;
  phone_number: string;
  address: string;
  designation: string;
  alternate_no: string | null;
}

export interface AgendaItem {
  id: number;
  time: string | null;
  title: string;
  description: string;
  speaker: string;
  date: string; // ISO date string
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  location: string;
  organizer: Organizer;
  attendees: Attendee[];
  attendees_count: number;
  sponsors: any[]; // Define detailed type if needed
  agenda_items: AgendaItem[];
  created_at: string;
  updated_at: string;
  thumbnail: string | null;
  wishes: any[]; // Define detailed type if needed
  offers: any[]; // Define detailed type if needed
  tags: Tag[];
}
