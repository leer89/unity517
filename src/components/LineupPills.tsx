export type Artist = {
  name: string;
  url: string; // curated link if given, otherwise a Google "name spotify" search fallback
  curated: boolean;
};

// Each line is "Artist Name" or "Artist Name | https://exact-link".
// No pipe → we don't know their exact page, so the pill falls back to a
// Google search for "<name> spotify" (better than a dead button, worse than
// the real thing). This goes through Google rather than a direct
// open.spotify.com search link on purpose: when the Spotify app is
// installed, the OS hands any open.spotify.com link straight to the app,
// but the app doesn't reliably honor a free-text search query from a link -
// it just opens to the Search tab's "recent" screen, dropping the query
// entirely. Google isn't intercepted by the app, so the search actually
// runs; tapping the Spotify result from there is a real artist-page link,
// which the app does deep-link correctly. Pipe with a URL → that exact link
// is used instead, so a wrong search result can always be overridden by
// pasting the real link.
export function parseLineup(raw: string): Artist[] {
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
        url: curatedUrl ?? `https://www.google.com/search?q=${encodeURIComponent(`${name} spotify`)}`,
        curated: Boolean(curatedUrl),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

type Props = {
  lineup: string;
  // Smaller pills for tight spaces (the homepage banner) vs. the full-size
  // ones on an event's own page. Same component, same behavior either way.
  size?: "sm" | "md";
};

// The bubble/pill cloud itself, with no section wrapper or heading - just the
// artists. Shared between the event page's full Lineup section and the
// homepage banner's compact preview, so both look and behave identically.
export default function LineupPills({ lineup, size = "md" }: Props) {
  const artists = parseLineup(lineup);
  if (artists.length === 0) return null;

  const sizeClass = size === "sm" ? "px-3 py-1.5 text-[11px] sm:text-xs" : "px-3.5 py-2 text-xs sm:text-sm";

  return (
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
              `inline-flex items-center rounded-full border border-brand-line bg-brand-card ${sizeClass} font-medium uppercase tracking-wide text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan hover:-translate-y-px transition` +
              (artist.curated ? "" : " decoration-dotted underline decoration-brand-muted/50 underline-offset-4")
            }
            title={artist.curated ? artist.name : `${artist.name} (search)`}
          >
            {artist.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
