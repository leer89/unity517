-- Unity n Music 517 — initial schema
-- Public users can READ events/banner/site_copy.
-- Only authenticated users with role='admin' in `profiles` can WRITE.

----------------------------------------------------------------------
-- profiles: links auth.users -> role
----------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone authenticated can read their own profile (used by role checks).
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);

-- No public insert/update/delete on profiles; admins promote via Supabase dashboard
-- or via the SQL one-liner in DEPLOY.md.

-- Trigger: every new auth user gets a 'viewer' profile row automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

----------------------------------------------------------------------
-- is_admin() helper: used by every write policy below
----------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

----------------------------------------------------------------------
-- events
----------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  description text,
  flyer_url text,
  ticket_url text,
  is_featured boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at desc);
create index if not exists events_archived_idx on public.events (is_archived);

alter table public.events enable row level security;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (true);

drop policy if exists "events_admin_write" on public.events;
create policy "events_admin_write" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at auto-bump
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
  before update on public.events
  for each row execute function public.touch_updated_at();

----------------------------------------------------------------------
-- banner (singleton: id=1)
----------------------------------------------------------------------
create table if not exists public.banner (
  id integer primary key default 1 check (id = 1),
  image_url text,
  headline text,
  subheadline text,
  cta_label text,
  cta_url text,
  updated_at timestamptz not null default now()
);

alter table public.banner enable row level security;

drop policy if exists "banner_public_read" on public.banner;
create policy "banner_public_read" on public.banner
  for select using (true);

drop policy if exists "banner_admin_write" on public.banner;
create policy "banner_admin_write" on public.banner
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists banner_updated_at on public.banner;
create trigger banner_updated_at
  before update on public.banner
  for each row execute function public.touch_updated_at();

-- Ensure the singleton row exists.
insert into public.banner (id) values (1) on conflict (id) do nothing;

----------------------------------------------------------------------
-- site_copy: key/value editable text blocks
----------------------------------------------------------------------
create table if not exists public.site_copy (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_copy enable row level security;

drop policy if exists "site_copy_public_read" on public.site_copy;
create policy "site_copy_public_read" on public.site_copy
  for select using (true);

drop policy if exists "site_copy_admin_write" on public.site_copy;
create policy "site_copy_admin_write" on public.site_copy
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists site_copy_updated_at on public.site_copy;
create trigger site_copy_updated_at
  before update on public.site_copy
  for each row execute function public.touch_updated_at();

-- Seed default copy keys.
insert into public.site_copy (key, value) values
  ('about', 'Unity n Music 517 is an underground music collective out of Lansing, MI. We throw shows that put community first — all ages, all genres, all welcome.'),
  ('contact', 'Booking + press: bookings@unitynmusic517.com')
on conflict (key) do nothing;

----------------------------------------------------------------------
-- Storage bucket for flyers + banner uploads
----------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
