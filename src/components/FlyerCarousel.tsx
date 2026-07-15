"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
};

// Instagram-style flyer gallery: horizontal scroll-snap track (native touch
// swipe, no gesture library needed) with dot indicators synced to whichever
// slide is centered, plus hover-revealed arrows for desktop/mouse users.
// Falls back to a single static image (no carousel chrome at all) when
// there's nothing to swipe between - most weekly flyers are one image.
export default function FlyerCarousel({ images, alt }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length <= 1) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(Math.min(Math.max(idx, 0), images.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [images.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActive(i);
  };

  if (images.length <= 1) {
    return (
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-line bg-brand-card">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/30 to-brand-cyan/20" />
        )}
      </div>
    );
  }

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-line bg-brand-card flex overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={src + i} className="relative w-full h-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt} - flyer ${i + 1} of ${images.length}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Slide counter, top-right - tells you there's more before you even swipe. */}
      <span className="absolute top-3 right-3 rounded-full bg-brand-ink/70 px-2.5 py-1 text-[11px] font-medium text-brand-paper tabular-nums">
        {active + 1}/{images.length}
      </span>

      {/* Desktop arrows - hidden until hover, like Instagram's. */}
      {active > 0 && (
        <button
          type="button"
          aria-label="Previous flyer"
          onClick={() => goTo(active - 1)}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-brand-ink/70 text-brand-paper opacity-0 group-hover/carousel:opacity-100 hover:bg-brand-ink transition"
        >
          ‹
        </button>
      )}
      {active < images.length - 1 && (
        <button
          type="button"
          aria-label="Next flyer"
          onClick={() => goTo(active + 1)}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-brand-ink/70 text-brand-paper opacity-0 group-hover/carousel:opacity-100 hover:bg-brand-ink transition"
        >
          ›
        </button>
      )}

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to flyer ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-4 bg-brand-cyan" : "w-1.5 bg-brand-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
