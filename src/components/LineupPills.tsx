export type Artist = {
  name: string;
  url: string; // curated link if given, otherwise a Google "name spotify" search fallback
  curated: boolean;
  headliner: boolean;
};

// Each line is "Artist Name" or "Artist Name | https://exact-link", optionally
// prefixed with "*" to mark a headliner - e.g. "*INZO" or
// "*Ganja Girl | https://ganjagirlmi.com". One flat textarea stays the single
// source of truth for the whole lineup (name, link override, and headliner
// status together) rather than a second "headliners" box that has to be kept
// in sync by matching text against the first - that's exactly the kind of
// two-places-to-agree setup that quietly drifts out of sync or typo-mismatches
// silently, the same failure shape as the bare-domain pipe issue earlier.
//
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
      const headliner = /^\*\s*/.test(line);
      const stripped = line.replace(/^\*\s*/, "");
      const [namePart, urlPart] = stripped.split("|").map((s) => s.trim());
      const name = namePart || stripped;
      const curatedUrl = urlPart && /^https?:\/\//i.test(urlPart) ? urlPart : null;
      return {
        name,
        url: curatedUrl ?? `https://www.google.com/search?q=${encodeURIComponent(`${name} spotify`)}`,
        curated: Boolean(curatedUrl),
        headliner,
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

function Pill({ artist, className }: { artist: Artist; className: string }) {
  return (
    <li>
      <a
        href={artist.url}
        target="_blank"
        rel="noreferrer"
        // Unconfirmed (search-fallback) links get a faint dotted underline -
        // a quiet, honest signal that this one's a guess, not a verified
        // link, without needing a legend or extra chrome to explain it.
        className={
          className +
          (artist.curated ? "" : " decoration-dotted underline decoration-brand-muted/50 underline-offset-4")
        }
        title={artist.curated ? artist.name : `${artist.name} (search)`}
      >
        {artist.name}
      </a>
    </li>
  );
}

// The bubble/pill cloud itself, with no section wrapper or heading - just the
// artists. Shared between the event page's full Lineup section and the
// homepage banner's compact preview, so both look and behave identically.
//
// Headliners (lines starting with "*") get their own row above the rest,
// bigger and bolder - the same tiering every real festival poster uses to
// tell you who's the draw without a "HEADLINER" label spelling it out. Size
// alone carries that meaning, same as the poster on your wall. If nothing
// is marked as a headliner, this renders exactly like one plain pill cloud -
// existing lineups with no "*" in them look completely unchanged.
export default function LineupPills({ lineup, size = "md" }: Props) {
  const artists = parseLineup(lineup);
  if (artists.length === 0) return null;

  const headliners = artists.filter((a) => a.headliner);
  const rest = artists.filter((a) => !a.headliner);

  const baseClass =
    "inline-flex items-center rounded-full border bg-brand-card font-medium uppercase tracking-wide transition hover:-translate-y-px";

  const restSizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-[11px] sm:text-xs"
      : "px-3.5 py-2 text-xs sm:text-sm";
  const restClass = `${baseClass} ${restSizeClass} border-brand-line text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan`;

  // One step up in size, bolder weight, brighter border at rest - a
  // deliberate bump, not a different visual system. The headline and CTA
  // still own the site's neon glow; headliners get emphasis, not a second
  // signature competing for attention.
  const headlinerSizeClass =
    size === "sm"
      ? "px-4 py-2 text-sm sm:text-base"
      : "px-5 py-2.5 text-base sm:text-lg";
  const headlinerClass = `${baseClass} ${headlinerSizeClass} font-bold border-brand-cyan/40 text-brand-paper hover:border-brand-cyan hover:text-brand-cyan`;

  return (
    <div className="flex flex-col gap-3">
      {headliners.length > 0 && (
        <ul className="flex flex-wrap gap-2.5">
          {headliners.map((artist) => (
            <Pill key={artist.name} artist={artist} className={headlinerClass} />
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {rest.map((artist) => (
            <Pill key={artist.name} artist={artist} className={restClass} />
          ))}
        </ul>
      )}
    </div>
  );
}
