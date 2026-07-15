-- Per-event social/song links (e.g. "official track on Spotify", TikTok,
-- Instagram - whatever's relevant to that specific show). One per line,
-- optional "Label | URL" - see src/components/EventLinks.tsx for parsing
-- and platform-icon detection.

alter table public.events
  add column if not exists links text;
