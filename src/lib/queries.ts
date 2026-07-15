// MVP fallback: if NEXT_PUBLIC_SUPABASE_URL isn't a real project, every helper
// returns hardcoded Unity Fest content so the public site renders without a
// live database. Live path takes over once env vars are configured.
import { createClient } from "@/lib/supabase/server";
import type { Banner, Event, SiteCopy } from "@/lib/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const USE_MOCKS = !URL || URL.includes("YOUR-PROJECT-REF") || URL.includes("stub");

const TS = "2026-05-01T00:00:00.000Z";

const FESTIVAL_LINEUP = [
  "John Beltran", "Raedy Lex", "Zak Bletz", "Beatloaf", "Mike Ransom",
  "Ganja Girl", "Ryan Sadorus", "Juan Trevino", "The DJ Bob Marino", "Beach House",
  "Dan Laino", "DJ DAV", "Bass Owl", "K-LALA", "VNM$",
  "Social Circle", "Prophet ECKS", "Damselfly", "Kiwii", "One",
  "YFPxDogmatik", "Kindly", "ABC Collective", "Chancellor", "Magictraxx",
  "Jay Arthur", "Rob Powell", "Disc Dolo", "Jason Patino", "DJ Batz",
  "The Don", "Mr Twista", "Katalist", "Brent Scudder",
].join("\n");

const MOCK_EVENTS: Event[] = [
  {
    id: "1", title: "Unity in Music Festival", slug: "unity-fest-2026",
    starts_at: "2026-08-30T15:00:00.000Z", ends_at: "2026-08-31T02:00:00.000Z",
    location: "216 E Grand River Ave, Old Town Lansing, MI",
    description: "All ages, free entry. Multiple stages, DJs, electronic music artists, vendors, food trucks, non-profits.",
    flyer_url: "/unity-fest.png", ticket_url: null, lineup: FESTIVAL_LINEUP,
    is_featured: true, is_archived: false, sort_order: 1, created_at: TS, updated_at: TS,
  },
  {
    id: "2", title: "Unity in Music - The Avenue", slug: "unity-in-music-avenue",
    starts_at: "2026-06-21T01:00:00.000Z", ends_at: "2026-06-21T06:00:00.000Z",
    location: "The Avenue Cafe, Lansing, MI",
    description: "Evolve Studios x GG present a night of underground electronic music.",
    flyer_url: "/unity-in-music.png", ticket_url: null, lineup: null,
    is_featured: false, is_archived: false, sort_order: 2, created_at: TS, updated_at: TS,
  },
  {
    id: "3", title: "Late Night Sessions", slug: "late-night-sessions",
    starts_at: "2026-07-12T02:00:00.000Z", ends_at: null,
    location: "Old Town Lansing, MI", description: "Local DJs till close.",
    flyer_url: null, ticket_url: null, lineup: null,
    is_featured: false, is_archived: false, sort_order: 3, created_at: TS, updated_at: TS,
  },
];

const MOCK_BANNER: Banner = {
  id: 1, image_url: "/unity-fest.png",
  headline: "UNITY IN MUSIC FESTIVAL",
  subheadline: "Aug 30 - Old Town Lansing - All Ages - Free Entry",
  cta_label: "See the lineup", cta_url: "#events", updated_at: TS,
};

const MOCK_COPY: Record<string, string> = {
  about: "Unity n Music 517 is an underground music collective out of Lansing, MI. We throw shows that put community first - all ages, all genres, all welcome.",
  contact: "Booking + press: bookings@unitynmusic517.com",
};

// Grid order is admin-controlled (see /admin/events/reorder) via sort_order,
// falling back to soonest-first for events that haven't been manually placed.
export async function getUpcomingEvents(): Promise<Event[]> {
  if (USE_MOCKS) return MOCK_EVENTS.filter((e) => !e.is_archived);
  const supabase = createClient();
  const now = new Date().toISOString();
  const { data } = await supabase.from("events").select("*").eq("is_archived", false)
    .or(`starts_at.gte.${now},ends_at.gte.${now}`)
    .order("sort_order", { ascending: true }).order("starts_at", { ascending: true });
  return (data ?? []) as Event[];
}

export async function getFeaturedEvent(): Promise<Event | null> {
  if (USE_MOCKS) return MOCK_EVENTS.find((e) => e.is_featured) ?? null;
  const supabase = createClient();
  const now = new Date().toISOString();
  const { data } = await supabase.from("events").select("*").eq("is_featured", true)
    .eq("is_archived", false).or(`starts_at.gte.${now},ends_at.gte.${now}`)
    .order("starts_at", { ascending: true }).limit(1).maybeSingle();
  return (data ?? null) as Event | null;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (USE_MOCKS) return MOCK_EVENTS.find((e) => e.slug === slug) ?? null;
  const supabase = createClient();
  const { data } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  return (data ?? null) as Event | null;
}

export async function getBanner(): Promise<Banner | null> {
  if (USE_MOCKS) return MOCK_BANNER;
  const supabase = createClient();
  const { data } = await supabase.from("banner").select("*").eq("id", 1).maybeSingle();
  return (data ?? null) as Banner | null;
}

export async function getSiteCopy(key: string): Promise<string | null> {
  if (USE_MOCKS) return MOCK_COPY[key] ?? null;
  const supabase = createClient();
  const { data } = await supabase.from("site_copy").select("value").eq("key", key).maybeSingle();
  return (data?.value as string) ?? null;
}

export async function getAllSiteCopy(): Promise<SiteCopy[]> {
  if (USE_MOCKS) return Object.entries(MOCK_COPY).map(([key, value]) => ({ key, value, updated_at: TS }));
  const supabase = createClient();
  const { data } = await supabase.from("site_copy").select("*").order("key");
  return (data ?? []) as SiteCopy[];
}
