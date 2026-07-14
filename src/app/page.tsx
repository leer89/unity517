import Hero from "@/components/Hero";
import FeaturedEvent from "@/components/FeaturedEvent";
import EventGrid from "@/components/EventGrid";
import { getBanner, getFeaturedEvent, getUpcomingEvents } from "@/lib/queries";

// Re-render on every request so newly-added events show up immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [banner, featured, upcoming] = await Promise.all([
    getBanner(),
    getFeaturedEvent(),
    getUpcomingEvents(),
  ]);

  // The newest event always goes up top. We sort upcoming ascending in
  // queries.ts so they list in chronological order, and the featured event
  // is shown separately above the grid.
  const nonFeaturedUpcoming = upcoming.filter((e) => !featured || e.id !== featured.id);

  // schema.org Organization JSON-LD. Establishes the org as a search entity
  // and links to social. Goes on the homepage only (sitewide info, not per-page).
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Unity n Music 517",
    url: "https://unity.makotechs.com",
    sameAs: ["https://www.instagram.com/unitynmusic517/"],
    location: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Lansing", addressRegion: "MI", addressCountry: "US" },
    },
    genre: ["Electronic", "EDM", "Hip-Hop"],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero banner={banner} />
      {featured && <FeaturedEvent event={featured} />}
      <EventGrid events={nonFeaturedUpcoming} />
    </main>
  );
}
