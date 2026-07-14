# Deploy — unity.makotechs.com

End-to-end walkthrough from empty Supabase project + GitHub repo to a live site on `unity.makotechs.com`.

## 1. Create the Supabase project

1. Go to <https://supabase.com> → New project. Name it `unity517`. Pick the region closest to Michigan (us-east-1 / `East US (N. Virginia)`).
2. Save the database password somewhere safe.
3. Once it's provisioned, go to **Project Settings → API**. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Run the SQL migrations

In the Supabase dashboard, open **SQL Editor → New query** and run, in order:

1. Paste the contents of `supabase/migrations/001_init.sql` → Run.
2. Paste `supabase/migrations/002_seed_unity_fest.sql` → Run.

This creates the `events`, `banner`, `site_copy`, `profiles` tables, the `media` storage bucket, all RLS policies, and seeds the Unity Fest event.

## 3. Create the first admin

Auth → Users → **Add user** (email + password). Sign yourself up.

Then SQL Editor → run:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOU@example.com');
```

(Replace `YOU@example.com` with the email you just used.)

That account can now sign in at `/admin/login`.

## 4. Push the code to GitHub

The remote already exists at <https://github.com/leer89/unity517>. From the project root:

```bash
git init
git branch -M main
git remote add origin https://github.com/leer89/unity517.git
git add .
git commit -m "Initial site"
git push -u origin main
```

## 5. Deploy on Vercel

1. Go to <https://vercel.com/new>. Import the `leer89/unity517` repo.
2. Framework preset: **Next.js** (auto-detected).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Click **Deploy**. First build takes ~2 minutes.

## 6. Point unity.makotechs.com at Vercel

In Vercel → Project → **Settings → Domains**:

1. Add domain `unity.makotechs.com`. Vercel will show you a DNS record to add.
2. At your DNS host for `makotechs.com`, add:
   - **Type:** CNAME
   - **Host:** `unity`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** Auto / 3600
3. Wait 1–5 minutes. Vercel auto-issues a Let's Encrypt cert.

Once the green checkmark shows in Vercel, <https://unity.makotechs.com> is live.

## 7. Update the Supabase project's site URL (so auth emails work)

Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://unity.makotechs.com`
- **Redirect URLs:** add `https://unity.makotechs.com/**`

This matters once you turn on magic links or password resets later. For email+password sign-in it isn't strictly required, but set it now so future you doesn't get burned.

## 8. Smoke test

- Visit `https://unity.makotechs.com` — should show the Unity Fest hero + featured card.
- Visit `https://unity.makotechs.com/admin/login` — sign in with the admin account.
- Create a test event with a flyer upload. Verify it shows on the homepage. Delete it.
- Visit `https://unity.makotechs.com/admin` directly while signed out — should redirect to `/admin/login`.

## Ongoing

- **Add an event:** `/admin/events/new` — fills in title, date, location, flyer, optional ticket link. Mark one as "Featured" to show it big at the top of the home page.
- **Swap the banner:** `/admin/banner` — change headline/subhead, upload a new background image.
- **Edit copy:** `/admin/copy` — About page text, contact, etc.
- **Past events** stay in the DB but auto-disappear from the public site once their `ends_at` (or `starts_at`) is in the past. You can also explicitly archive them.

## Cost

For this volume of traffic, the Supabase free tier and Vercel hobby tier are both well within limits and stay free indefinitely. Domain renewal at your registrar is the only recurring cost.
