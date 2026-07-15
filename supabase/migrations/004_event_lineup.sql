-- Adds an optional lineup field to events. One artist per line, admin-entered
-- via a textarea. Nullable/blank for weekly flyers that don't need one -
-- only the festival event (or any multi-artist show) fills this in.
-- Display sorts alphabetically at render time (see src/components/LineupList.tsx),
-- so admins can paste artists in any order.

alter table public.events
  add column if not exists lineup text;
