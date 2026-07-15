import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@/lib/queries";
import { formatEventDate } from "@/lib/format";
import LineupList from "@/components/LineupList";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// SEO — generated per event (title, description, OG image with the flyer).
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Event not found" };

  const dateStr = formatEventDate(event.starts_at, event.ends_at);
  const title = `${event.title} · ${dateStr}`;
  const description =
    event.description?.slice(0, 160) ??
    `${event.title} in Lansing, MI. ${dateStr}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: event.flyer_url ? [{ url: event.flyer_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.flyer_url ? [event.flyer_url] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);
  if (!event || event.is_archived) notFound();

  // schema.org Event JSON-LD. Helps Google show this in event-search rich
  // results once the site is indexed.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: event.location,
        }
      : undefined,
    image: event.flyer_url ? [event.flyer_url] : undefined,
    description: event.description ?? undefined,
    organizer: {
      "@type": "Organization",
      name: "Unity n Music 517",
      url: "https://unity.makotechs.com",
    },
    offers: event.ticket_url
      ? {
          "@type": "Offer",
          url: event.ticket_url,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-brand-muted hover:text-brand-paper">← Back</Link>

      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-line bg-brand-card">
          {event.flyer_url ? (
            <Image
              src={event.flyer_url}
              alt={event.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/30 to-brand-cyan/20" />
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-brand-cyan">
            {formatEventDate(event.starts_at, event.ends_at)}
          </span>
          <h1 className="display text-5xl sm:text-6xl text-brand-paper mt-3 neon-pink">{event.title}</h1>
          {event.location && (
            <p className="text-brand-paper/90 mt-4">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="text-brand-paper/85 mt-6 whitespace-pre-wrap leading-relaxed">{event.description}</p>
          )}
          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-cyan px-6 py-3 text-brand-ink font-semibold uppercase tracking-widest text-sm shadow-glow-cyan"
            >
              Get tickets →
            </a>
          )}
        </div>
      </div>

      {event.lineup && <LineupList lineup={event.lineup} />}
    </main>
  );
}
