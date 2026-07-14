-- Seeds the Unity Fest event so the public site has content immediately after deploy.
-- Run AFTER 001_init.sql.
-- The flyer_url initially points at the static asset bundled with the app.
-- After deployment, the admin can re-upload it to Supabase Storage and update the URL.

insert into public.events (
  title, slug, starts_at, ends_at, location, description, flyer_url, is_featured
) values (
  'Unity in Music Festival',
  'unity-fest-2026',
  '2026-08-30 11:00:00-04',  -- 11am Eastern
  '2026-08-30 22:00:00-04',  -- 10pm Eastern
  '216 E Grand River Ave, Old Town Lansing, MI',
  'All ages, free entry. Multiple stages, DJs, electronic music artists, vendors, food trucks, non-profits. The big one.',
  '/unity-fest.png',
  true
)
on conflict (slug) do nothing;
