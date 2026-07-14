import Image from "next/image";
import type { Banner } from "@/lib/types";

type HeroProps = {
  banner: Banner | null;
};

const DEFAULTS = {
  image_url: "/unity-fest.png",
  headline: "UNITY IN MUSIC FESTIVAL",
  subheadline: "Aug 30 · Old Town Lansing · All Ages · Free Entry",
  cta_label: "See the lineup",
  cta_url: "#events",
};

export default function Hero({ banner }: HeroProps) {
  const image = banner?.image_url ?? DEFAULTS.image_url;
  const headline = banner?.headline ?? DEFAULTS.headline;
  const subheadline = banner?.subheadline ?? DEFAULTS.subheadline;
  const ctaLabel = banner?.cta_label ?? DEFAULTS.cta_label;
  const ctaUrl = banner?.cta_url ?? DEFAULTS.cta_url;

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
      </div>
    </section>
  );
}
