-- Adds manual display ordering to events, independent of date.
-- Used by /admin/events/reorder (mobile-friendly move up/down controls).

alter table public.events
  add column if not exists sort_order integer not null default 0;

-- Backfill existing rows so the current chronological order is preserved
-- until an admin explicitly rearranges something.
with ordered as (
  select id, row_number() over (order by starts_at asc) as rn
  from public.events
)
update public.events e
set sort_order = ordered.rn
from ordered
where e.id = ordered.id;

create index if not exists events_sort_order_idx on public.events (sort_order);
