import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import { LABEL_URL, SPOTIFY_URL } from "@/lib/links";

type Props = {
  event: Event;
};

export default function FeaturedEvent({ event }: Props) {
  const hasGallery = (event.flyer_urls?.length ?? 0) > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper neon-cyan">Headlining</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-brand-muted">The big one</span>
      </div>

      <Link
        href={`/events/${event.slug}`}
        className="group block relative overflow-hidden rounded-2xl border border-brand-line bg-brand-card hover:border-brand-neon/60 transition shadow-glow-cyan/0 hover:shadow-glow-cyan"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[420px]">
            {event.flyer_url ? (
              <Image
                src={event.flyer_url}
                alt={event.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-[1.02] transition"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/30 via-brand-violet/20 to-brand-cyan/20" />
            )}
            {hasGallery && (
              <span
                title={`${(event.flyer_urls?.length ?? 0) + 1} photos`}
                className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-brand-ink/70 text-brand-paper"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="7" y="7" width="13" height="13" rx="2" />
                  <path d="M4 15V5a2 2 0 0 1 2-2h10" />
                </svg>
              </span>
            )}
          </div>
          <div className="p-6 sm:p-10 flex flex-col justify-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-neon">{formatEventDate(event.starts_at, event.ends_at)}</span>
            <h3 className="display text-4xl sm:text-5xl text-brand-paper">{event.title}</h3>
            {event.location && (
              <p className="text-brand-muted">📍 {event.location}</p>
            )}
            {event.description && (
              <p className="text-brand-paper/85 line-clamp-4">{event.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3">
              <span className="text-brand-cyan group-hover:translate-x-1 transition">Details →</span>
              {event.ticket_url && (
                <span className="text-brand-muted text-sm">· Tickets available</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Label + Spotify sit here, tied to the festival itself, rather than
          buried only in the footer - this is the highest-attention real
          estate on the page while the festival is the featured event.
          Kept as a sibling row (not nested inside the card's own link) so
          we don't put an <a> inside an <a>. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={LABEL_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3 py-1.5 text-xs uppercase tracking-widest text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan transition"
        >
          Unity In Music Records ↗
        </a>
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3 py-1.5 text-xs uppercase tracking-widest text-brand-paper/90 hover:border-brand-neon/60 hover:text-brand-neon transition"
        >
          Listen on Spotify ↗
        </a>
      </div>
    </section>
  );
}
