# Unity n Music 517

Underground music + events site for [@unitynmusic517](https://www.instagram.com/unitynmusic517/), Lansing MI.

**Stack:** Next.js 14 · TypeScript · Tailwind · Supabase · Vercel.

## Documentation

- 📘 **[CLAUDE.md](./CLAUDE.md)** — canonical project reference (architecture, diagrams, capabilities). Start here.
- 🚀 **[DEPLOY.md](./DEPLOY.md)** — step-by-step deploy to `unity.makotechs.com`.
- 🎨 **[DESIGN.md](./DESIGN.md)** — design rationale, wireframes, Krug audit, engineering patterns.
- 📒 **[LESSONS_LEARNED.md](./LESSONS_LEARNED.md)** — running log of mistakes + generalized lessons. Maintained automatically.

## TL;DR local run

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + anon key
npm run dev                        # http://localhost:3000
```

Admin lives at `/admin` (unlinked from the public site). See `CLAUDE.md §2` for the full setup, including running migrations and creating the first admin user.
