export type ArtistSegment = {
  name: string;
  url: string; // curated link if given, otherwise a Google "name spotify" search fallback
  curated: boolean;
};

export type Artist = {
  key: string; // original name text, used for sorting + React key
  segments: ArtistSegment[]; // 1 for a normal artist, 2+ for a b2b/back-to-back set
  headliner: boolean;
};

// Splits "Name A b2b Name B" (any case, "b2b" surrounded by spaces) into
// separate artists. A back-to-back set is two people playing together, not
// one act with a compound name - searching "Name A b2b Name B" on Spotify or
// Google finds nothing useful, so each half needs its own independent
// search/link while still visually reading as one billed set, the way a
// festival poster prints "NAME A B2B NAME B" as a single line.
const B2B_SPLIT = /\s+b2b\s+/i;

function buildSegment(name: string, url: string | undefined): ArtistSegment {
  const curatedUrl = url && /^https?:\/\//i.test(url) ? url : null;
  return {
    name,
    url: curatedUrl ?? `https://www.google.com/search?q=${encodeURIComponent(`${name} spotify`)}`,
    curated: Boolean(curatedUrl),
  };
}

// Each line is "Artist Name" or "Artist Name | https://exact-link", optionally
// prefixed with "*" to mark a headliner - e.g. "*INZO" or
// "*Ganja Girl | https://ganjagirlmi.com". One flat textarea stays the single
// source of truth for the whole lineup (name, link override, and headliner
// status together) rather than a second "headliners" box that has to be kept
// in sync by matching text against the first - that's exactly the kind of
// two-places-to-agree setup that quietly drifts out of sync or typo-mismatches
// silently, the same failure shape as the bare-domain pipe issue earlier.
//
// A b2b line can carry one curated link per artist, in the same order, each
// after its own pipe: "Name A b2b Name B | https://.../a | https://.../b".
// If the number of links doesn't match the number of names, we don't guess
// which link belongs to which artist - both fall back to search instead of
// risking a wrong match.
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
      const parts = stripped.split("|").map((s) => s.trim());
      const namePart = parts[0];
      const urlParts = parts.slice(1);

      const names = namePart.split(B2B_SPLIT).map((s) => s.trim()).filter(Boolean);
      const segments =
        names.length > 1
          ? names.map((name, i) => buildSegment(name, urlParts.length === names.length ? urlParts[i] : undefined))
          : [buildSegment(namePart, urlParts[0])];

      return { key: namePart, segments, headliner };
    })
    .sort((a, b) => a.key.localeCompare(b.key, undefined, { sensitivity: "base" }));
}

type Props = {
  lineup: string;
  // Smaller pills for tight spaces (the homepage banner) vs. the full-size
  // ones on an event's own page. Same component, same behavior either way.
  size?: "sm" | "md";
};

function segmentLinkClass(curated: boolean) {
  return curated ? "" : " decoration-dotted underline decoration-current/40 underline-offset-4";
}

// A normal, single-artist pill: the whole pill is one link, full pill chrome
// (border, background, hover glow) lives on the <a> itself so the entire
// bubble is the tap target - unchanged from before b2b support existed.
function SinglePill({ segment, className }: { segment: ArtistSegment; className: string }) {
  return (
    <li>
      <a
        href={segment.url}
        target="_blank"
        rel="noreferrer"
        className={className + segmentLinkClass(segment.curated)}
        title={segment.curated ? segment.name : `${segment.name} (search)`}
      >
        {segment.name}
      </a>
    </li>
  );
}

// A b2b pill: pill chrome lives on a non-interactive wrapper, since there are
// two independent tap targets inside (one per artist) joined by a small
// static "B2B" connector - each name still finds its own page, but they read
// as one billed set rather than two unrelated pills floating side by side.
function B2BPill({ artist, wrapperClass, linkClass }: { artist: Artist; wrapperClass: string; linkClass: string }) {
  return (
    <li>
      <span className={wrapperClass}>
        {artist.segments.map((segment, i) => (
          <span key={segment.name} className="inline-flex items-center">
            {i > 0 && <span className="mx-1.5 text-brand-cyan/70 font-bold">B2B</span>}
            <a
              href={segment.url}
              target="_blank"
              rel="noreferrer"
              className={linkClass + segmentLinkClass(segment.curated)}
              title={segment.curated ? segment.name : `${segment.name} (search)`}
            >
              {segment.name}
            </a>
          </span>
        ))}
      </span>
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
    "inline-flex items-center rounded-full border bg-brand-card font-medium uppercase tracking-wide transition";

  const restSizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-[11px] sm:text-xs"
      : "px-3.5 py-2 text-xs sm:text-sm";
  const restSingleClass = `${baseClass} ${restSizeClass} border-brand-line text-brand-paper/90 hover:-translate-y-px hover:border-brand-cyan/60 hover:text-brand-cyan`;
  const restWrapperClass = `${baseClass} ${restSizeClass} border-brand-line text-brand-paper/90`;
  const restLinkClass = "hover:text-brand-cyan transition";

  // One step up in size, bolder weight, brighter border at rest - a
  // deliberate bump, not a different visual system. The headline and CTA
  // still own the site's neon glow; headliners get emphasis, not a second
  // signature competing for attention.
  const headlinerSizeClass =
    size === "sm"
      ? "px-4 py-2 text-sm sm:text-base"
      : "px-5 py-2.5 text-base sm:text-lg";
  const headlinerSingleClass = `${baseClass} ${headlinerSizeClass} font-bold border-brand-cyan/40 text-brand-paper hover:-translate-y-px hover:border-brand-cyan hover:text-brand-cyan`;
  const headlinerWrapperClass = `${baseClass} ${headlinerSizeClass} font-bold border-brand-cyan/40 text-brand-paper`;
  const headlinerLinkClass = "hover:text-brand-cyan transition";

  function renderPill(artist: Artist, singleClass: string, wrapperClass: string, linkClass: string) {
    if (artist.segments.length > 1) {
      return <B2BPill key={artist.key} artist={artist} wrapperClass={wrapperClass} linkClass={linkClass} />;
    }
    return <SinglePill key={artist.key} segment={artist.segments[0]} className={singleClass} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {headliners.length > 0 && (
        <ul className="flex flex-wrap gap-2.5">
          {headliners.map((artist) =>
            renderPill(artist, headlinerSingleClass, headlinerWrapperClass, headlinerLinkClass),
          )}
        </ul>
      )}
      {rest.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {rest.map((artist) => renderPill(artist, restSingleClass, restWrapperClass, restLinkClass))}
        </ul>
      )}
    </div>
  );
}
