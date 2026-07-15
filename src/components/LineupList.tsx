type Props = {
  lineup: string;
};

type Artist = {
  name: string;
  url: string; // curated link if given, otherwise a Spotify search fallback
  curated: boolean;
};

// Each line is "Artist Name" or "Artist Name | https://exact-link".
// No pipe → we don't know their exact page, so the pill falls back to a
// Spotify search for the name (better than a dead button, worse than the
// real thing). Pipe with a URL → that exact link is used instead, so a
// wrong search result can always be overridden by pasting the real link.
function parseLineup(raw: string): Artist[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, urlPart] = line.split("|").map((s) => s.trim());
      const name = namePart || line;
      const curatedUrl = urlPart && /^https?:\/\//i.test(urlPart) ? urlPart : null;
      return {
        name,
        url: curatedUrl ?? `https://open.spotify.com/search/${encodeURIComponent(name)}`,
        curated: Boolean(curatedUrl),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

// Flat, alphabetical, equal type-weight - the Time Warp convention (nobody's
// name is bigger than anyone else's). Rendered as a wrapping cloud of pill
// buttons, closer to how festival directories like Music Festival Wizard
// present a full lineup: dense, scannable, and actually pressable.
export default function LineupList({ lineup }: Props) {
  const artists = parseLineup(lineup);
  if (artists.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-brand-line">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper">Lineup</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-cyan whitespace-nowrap">
          A–Z · {artists.length} artists · tap to hear
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {artists.map((artist) => (
          <li key={artist.name}>
            <a
              href={artist.url}
              target="_blank"
              rel="noreferrer"
              // Unconfirmed (search-fallback) links get a faint dotted underline -
              // a quiet, honest signal that this one's a guess, not a verified
              // link, without needing a legend or extra chrome to explain it.
              className={
                "inline-flex items-center rounded-full border border-brand-line bg-brand-card px-3.5 py-2 text-xs sm:text-sm font-medium uppercase tracking-wide text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan hover:-translate-y-px transition" +
                (artist.curated ? "" : " decoration-dotted underline decoration-brand-muted/50 underline-offset-4")
              }
              title={artist.curated ? artist.name : `${artist.name} (Spotify search)`}
            >
              {artist.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
