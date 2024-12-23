

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
  attendees: Attendee[]; // Fixed attendee typing
  sponsors: Sponsor[];   // Fixed sponsor typing
  agenda_items: AgendaItem[]; // Fixed agenda_items typing
  created_at: string;
  updated_at: string;
  thumbnail: string;
  slug: string;
  tags: Tag[];
}
