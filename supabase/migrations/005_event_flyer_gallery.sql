-- Additional flyer images beyond the single cover flyer_url, so an event can
-- have a swipeable, Instagram-style gallery on its own page. flyer_url stays
-- the "cover" - what shows in the grid/cards/OG image - unchanged.
-- flyer_urls holds the *rest* of the slides, in display order.

alter table public.events
  add column if not exists flyer_urls text[] not null default '{}'::text[];
