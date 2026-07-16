import type { Banner } from "@/lib/types";
import { daysUntil } from "@/lib/format";
import LineupPills from "@/components/LineupPills";
import EventLinks from "@/components/EventLinks";

type HeroProps = {
  banner: Banner | null;
  // ISO start date of the currently-featured event, if any. Drives the
  // countdown badge - the one number on this page that answers "why does
  // this site look like it's all about a festival that's months away."
  festivalDate?: string | null;
  // Slug of the currently-featured event. Used so the CTA can point at its
  // real page (where the lineup now lives) instead of a same-page anchor.
  festivalSlug?: string | null;
  // Featured event's lineup, if it has one. Shown right here in the banner
  // so people see it without having to click through first.
  lineup?: string | null;
  // Featured event's links (official song, TikTok, etc). Same idea - shown
  // right in the banner, not just on the event's own page.
  links?: string | null;
};

const DEFAULTS = {
  image_url: "/unity-fest.png",
  headline: "UNITY IN MUSIC FESTIVAL",
  subheadline: "Aug 30 · Old Town Lansing · All Ages · Free Entry",
  cta_label: "See the lineup",
  cta_url: "#events",
};

export default function Hero({ banner, festivalDate, festivalSlug, lineup, links }: HeroProps) {
  const image = banner?.image_url ?? DEFAULTS.image_url;
  const headline = banner?.headline ?? DEFAULTS.headline;
  const subheadline = banner?.subheadline ?? DEFAULTS.subheadline;
  const ctaLabel = banner?.cta_label ?? DEFAULTS.cta_label;

  // An anchor link (or the unedited default) doesn't actually go anywhere
  // useful once the lineup lives on the event's own page - send it there
  // instead. Admins can still override with a real URL/path from /admin/banner.
  const rawCtaUrl = banner?.cta_url ?? DEFAULTS.cta_url;
  const ctaUrl = rawCtaUrl.startsWith("#") && festivalSlug ? `/events/${festivalSlug}` : rawCtaUrl;

  const days = festivalDate ? daysUntil(festivalDate) : null;

  // The subheadline is logistics, not prose - date, place, age policy, cost.
  // Four separate facts someone scans for, not a sentence to read start to
  // finish. Splitting on the middle dot and giving each dot its own accent
  // color turns it into a quick-scan row instead of one long faint line,
  // while still degrading gracefully if an admin types something with no
  // dots in it at all (renders as a single plain segment, just bigger).
  const subheadlineParts = subheadline.split("·").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Plain CSS background image rather than next/image here - next/image's
          optimizer was silently failing to paint admin-uploaded photos in
          production (reported as loaded, correct dimensions, but never
          rendered - confirmed via direct pixel testing). A CSS background
          sidesteps that pipeline entirely and is proven to work reliably.
          Legibility comes from a directional gradient instead of dimming the
          whole image: dark where the headline sits (left, and on mobile
          where text spans full width), clear where there's nothing to read
          over. A short fade at the very bottom blends into the page below. */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/75 to-brand-ink/10 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div className="flex flex-col items-start gap-6 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full border border-brand-neon/60 text-brand-neon text-xs tracking-[0.2em] uppercase shadow-glow-neon">
              Featured · Now
            </span>
            <h1 className="display text-5xl sm:text-7xl lg:text-8xl text-brand-paper neon-pink">
              {headline}
            </h1>
            <p className="text-lg sm:text-2xl font-medium text-brand-paper max-w-xl leading-snug">
              {subheadlineParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2 text-brand-cyan">·</span>}
                  {part}
                </span>
              ))}
            </p>
            {ctaUrl && ctaLabel && (
              <a
                href={ctaUrl}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-neon px-6 py-3 text-brand-ink font-semibold uppercase tracking-widest text-sm shadow-glow-neon hover:translate-y-[-1px] transition"
              >
                {ctaLabel} →
              </a>
            )}

            {/* Links live right under the CTA, in the primary hero viewport -
                the most prominent spot on the page, not scrolled past. */}
            {links && <EventLinks links={links} />}
          </div>

          {/* Countdown: the thing that lets weekly Tuesday/Thursday flyers keep
              showing up in the grid below without competing with the festival -
              it's not "instead of" the festival, it's "counting down to" it. */}
          {days !== null && (
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-0 shrink-0">
              <span className="display text-6xl sm:text-7xl text-brand-paper neon-cyan leading-none">
                {days}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-brand-cyan sm:mt-1">
                {days === 1 ? "day to go" : "days to go"}
              </span>
            </div>
          )}
        </div>

        {/* Lineup preview, right in the banner - same bubbles as the event
            page, smaller size to fit the hero. Full list, not a teaser: the
            whole point of alphabetical/equal-weight is nobody gets buried. */}
        {lineup && (
          <div className="mt-10 pt-8 border-t border-brand-paper/10">
            <span className="block text-[11px] uppercase tracking-[0.25em] text-brand-cyan mb-3">
              Lineup
            </span>
            <LineupPills lineup={lineup} size="sm" />
          </div>
        )}
      </div>
    </section>
  );
}
