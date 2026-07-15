// Shared types. Mirrors the Supabase schema in supabase/migrations/001_init.sql,
// 003_event_sort_order.sql, 004_event_lineup.sql, 005_event_flyer_gallery.sql, and 006_event_links.sql.

export type Event = {
  id: string;
  title: string;
  slug: string;
  starts_at: string; // ISO timestamp
  ends_at: string | null;
  location: string | null;
  description: string | null;
  flyer_url: string | null;
  flyer_urls: string[]; // additional gallery images beyond the cover (flyer_url)
  ticket_url: string | null;
  lineup: string | null; // newline-separated artist names, optional
  links: string | null; // newline-separated social/song links, optional
  is_featured: boolean;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteCopy = {
  key: string; // e.g. "about", "contact", "footer"
  value: string;
  updated_at: string;
};

export type Banner = {
  id: number; // singleton row, always 1
  image_url: string | null;
  headline: string | null;
  subheadline: string | null;
  cta_label: string | null;
  cta_url: string | null;
  updated_at: string;
};

export type Profile = {
  id: string; // matches auth.users.id
  role: "admin" | "viewer";
  created_at: string;
};
