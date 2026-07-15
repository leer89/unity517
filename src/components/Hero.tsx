import Image from "next/image";
import type { Banner } from "@/lib/types";
import { daysUntil } from "@/lib/format";

type HeroProps = {
  banner: Banner | null;
  // ISO start date of the currently-featured event, if any. Drives the
  // countdown badge - the one number on this page that answers "why does
  // this site look like it's all about a festival that's months away."
  festivalDate?: string | null;
  // Slug of the currently-featured event. Used so the CTA can point at its
  // real page (where the lineup now lives) instead of a same-page anchor.
  festivalSlug?: string | null;
};

const DEFAULTS = {
  image_url: "/unity-fest.png",
  headline: "UNITY IN MUSIC FESTIVAL",
  subheadline: "Aug 30 · Old Town Lansing · All Ages · Free Entry",
  cta_label: "See the lineup",
  cta_url: "#events",
};

export default function Hero({ banner, festivalDate, festivalSlug }: HeroProps) {
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

  return (
    <section className="relative overflow-hidden">
      {/* Background flyer at low opacity, full-bleed, with a heavy gradient over it. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-brand-ink/70 to-brand-ink" />
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
            <p className="text-base sm:text-lg text-brand-paper/90 max-w-xl">
              {subheadline}
            </p>
            {ctaUrl && ctaLabel && (
              <a
                href={ctaUrl}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-neon px-6 py-3 text-brand-ink font-semibold uppercase tracking-widest text-sm shadow-glow-neon hover:translate-y-[-1px] transition"
              >
                {ctaLabel} →
              </a>
            )}
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
      </div>
    </section>
  );
}
