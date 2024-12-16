export interface Event {
  id: number;
  slug: string;
  title: string;
  thumbnail: string;
  start_date: string;
  end_date: string;
  description: string;
  attendees: Attendee[];
  tags: string[];
}

export interface Organizer {
  id: number;
  name: string;
  email: string;
  image: string;
  phone: string;
  website: string;
  description: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  image: string;
  phone: string;
  website: string;
  description: string;
}
