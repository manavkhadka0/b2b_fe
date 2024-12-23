export interface Tag {
  id: number;
  name: string;
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

export interface Attendee {
  id: number;
  name: string;
  email: string;
  image: string;
  phone: string;
  website: string;
  description: string;
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: Tag[];
  start_date: string;
  end_date: string;
  location: string;
  organizer: Organizer;
  attendees_count: number;
  thumbnail: string | null;
  attendees: Attendee[];
}

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
}
