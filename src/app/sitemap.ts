import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

// Next will serve this as /sitemap.xml. Regenerated at request time so newly
// added events appear in the sitemap immediately.
export const dynamic = "force-dynamic";

const BASE = "https://unity.makotechs.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("slug, updated_at")
    .eq("is_archived", false);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = (data ?? []).map((e: any) => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: e.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes];
}
