type Props = {
  lineup: string;
};

// Flat, alphabetical, equal type-weight - the Time Warp convention (nobody's
// name is bigger than anyone else's). But rendered as a wrapping cloud of
// pill buttons, closer to how festival directories like Music Festival
// Wizard present a full lineup: dense, scannable, and actually pressable.
//
// Each pill opens a Spotify search for that name. We don't have per-artist
// pages on this site, so rather than ship dead buttons, "clickable" means
// "goes and finds their music" - the one destination that's genuinely true
// for every name on this list without the admin having to curate 30+ links.
export default function LineupList({ lineup }: Props) {
  const names = lineup
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  if (names.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-brand-line">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper">Lineup</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-cyan whitespace-nowrap">
          A–Z · {names.length} artists · tap to hear
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {names.map((name) => (
          <li key={name}>
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(name)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-brand-line bg-brand-card px-3.5 py-2 text-xs sm:text-sm font-medium uppercase tracking-wide text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan hover:-translate-y-px transition"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
