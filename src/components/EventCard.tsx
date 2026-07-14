import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-xl overflow-hidden border border-brand-line bg-brand-card hover:border-brand-neon/60 transition"
    >
      <div className="relative aspect-[3/4] bg-brand-ink">
        {event.flyer_url ? (
          <Image
            src={event.flyer_url}
            alt={event.title}
            fill
            sizes="(min-width: 1536px) 11vw, (min-width: 1280px) 16vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/30 to-brand-cyan/20" />
        )}
        {event.is_featured && (
          <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-brand-neon text-brand-ink font-bold tracking-widest uppercase">★ Featured</span>
        )}
      </div>
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-brand-cyan mb-1">
          {formatEventDate(event.starts_at, event.ends_at)}
        </div>
        <div className="display text-lg leading-tight text-brand-paper line-clamp-2">{event.title}</div>
        {event.location && (
          <div className="text-xs text-brand-muted mt-1 line-clamp-1">{event.location}</div>
        )}
      </div>
    </Link>
  );
}
