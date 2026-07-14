import type { Event } from "@/lib/types";
import EventCard from "./EventCard";

type Props = {
  events: Event[];
};

export default function EventGrid({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-brand-muted text-center py-12 border border-dashed border-brand-line rounded-xl">
          No upcoming events yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <section id="events" className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper">Upcoming</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-brand-muted">{events.length} show{events.length === 1 ? "" : "s"}</span>
      </div>

      {/*
        Mobile-first responsive grid.
        Breakpoints: 1 → 2 (sm) → 3 (md) → 4 (lg) → 6 (xl) → 9 (2xl)
        On a 9-wide desktop screen, cards stay readable because the aspect
        ratio is 3:4 and the max-w-7xl container caps the overall width.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9 gap-3 sm:gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
