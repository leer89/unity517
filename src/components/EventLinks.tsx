type Platform = "spotify" | "tiktok" | "instagram" | "youtube" | "soundcloud" | "x" | "facebook" | "link";

type EventLink = {
  label: string;
  url: string;
  platform: Platform;
};

// Simple, generic line-art glyphs (not exact reproductions of any brand's
// logo artwork) - enough to be instantly recognizable at pill size without
// reproducing trademarked mark files.
const ICONS: Record<Platform, JSX.Element> = {
  spotify: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7 10c3.5-1 6.5-1 10 1" />
      <path d="M7.5 13c3-.8 5.5-.8 8.5.6" />
      <path d="M8 16c2.3-.6 4.3-.6 6.5.5" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.5 2.5 2.2 4 4.5 4.2" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 15v-3M6 16v-6M9 16.5V9M12 16.5V6M15 16.5v-7a3.5 3.5 0 0 1 6.8-1.2A3 3 0 0 1 21 14.5h-6" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M14 21v-7h2.5l.5-3H14v-2c0-.9.3-1.5 1.7-1.5H17V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.3-3.7 3.8V11H8.5v3H11v7" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 15l6-6" />
      <path d="M10 6l1-1a4 4 0 0 1 5.7 5.7l-1 1" />
      <path d="M14 18l-1 1a4 4 0 0 1-5.7-5.7l1-1" />
    </svg>
  ),
};

const PLATFORM_LABELS: Record<Platform, string> = {
  spotify: "Spotify",
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  x: "X",
  facebook: "Facebook",
  link: "Link",
};

function detectPlatform(url: string): Platform {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "link";
  }
  if (host.includes("spotify.com")) return "spotify";
  if (host.includes("tiktok.com")) return "tiktok";
  if (host.includes("instagram.com")) return "instagram";
  if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
  if (host.includes("soundcloud.com")) return "soundcloud";
  if (host.includes("twitter.com") || host.includes("x.com")) return "x";
  if (host.includes("facebook.com") || host.includes("fb.com")) return "facebook";
  return "link";
}

// Each line is "https://..." or "Label | https://..." - same convention as
// the lineup field. No label → we name the pill after the platform we
// detected ("Spotify", "TikTok", ...), so a bare URL still reads cleanly.
function parseLinks(raw: string): EventLink[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, urlPart] = line.includes("|") ? line.split("|").map((s) => s.trim()) : [null, line];
      const url = urlPart || line;
      const platform = detectPlatform(url);
      return {
        url,
        platform,
        label: labelPart || PLATFORM_LABELS[platform],
      };
    })
    .filter((l) => /^https?:\/\//i.test(l.url));
}

type Props = {
  links: string;
};

// Icon + label pill row for event-specific links (an official track, that
// event's TikTok, etc.) - separate from the sitewide label/Spotify chips in
// FeaturedEvent, which are always the same two links. These change per event.
export default function EventLinks({ links }: Props) {
  const parsed = parseLinks(links);
  if (parsed.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {parsed.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-card px-3.5 py-2 text-xs sm:text-sm font-medium uppercase tracking-wide text-brand-paper/90 hover:border-brand-cyan/60 hover:text-brand-cyan transition"
        >
          {ICONS[link.platform]}
          {link.label}
        </a>
      ))}
    </div>
  );
}
