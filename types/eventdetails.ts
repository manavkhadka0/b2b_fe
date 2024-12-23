export interface Sponsor {
  id: number;
  name: string;
  logo: string; // URL to the sponsor's logo
  website: string;
  location: string | null; // Sponsor's location (optional)
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
  start_date: string;
  end_date: string;
  location: string;
  sponsors: Sponsor[]; // Array of sponsors
  agenda_items: AgendaItem[]; // Array of agenda items
  attendees_count: number;
}
