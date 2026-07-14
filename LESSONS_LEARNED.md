# Lessons Learned — Unity517

> Running log of every mistake made during this build, with the generalized lesson. Maintained automatically — not on request. New entries go at the top so the most recent reflection reads first.

---

## L-017 · Supabase clients threw before mock fallbacks ran

**What happened.** Built a `queries.ts` with mock-data fallback for MVP, but the Supabase middleware ran on every request and called `createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, ...)` — the `!` lies to TS but the runtime threw "Your project's URL and Key are required to create a Supabase client" before `queries.ts` was reached. The user ran `npm run dev`, got a red error page, and had every right to ask "why are you fucking with me."

**Why it happened.** Mock fallback was added at the query layer, but I never traced the request path through middleware + client constructors. The error was thrown before my fallback was reachable.

**Lesson for future projects.**
- Mock-data fallbacks must live at **every** boundary that touches the missing dep — not just the read layer. Middleware, server client, browser client, storage helpers — all of them.
- The `!` non-null assertion is a smell: if a value can be undefined at runtime (env vars always can), defend with an early `if (!x) return ...` rather than asserting.
- Before declaring an MVP "ready to run," mentally trace a single GET request through every file that imports the missing dep. If any of them throws on missing env, the MVP isn't ready.
- For Next.js + Supabase specifically: middleware runs first and runs on every request. It's the most-common silent killer when env isn't set.

---

## L-016 · Kept burning cycles on Next when the user said "just MVP"

**What happened.** User asked for a "local mvp" — three times — while I was on round 5 of fighting Next.js build errors. The right move (single static `mvp.html`) was 30 seconds of work but I didn't pivot until the user explicitly said "bro, mvp?" twice. I treated "make Next build green" as the goal when the goal was "let me see the design."

**Why it happened.** I was anchored on the "correct" deliverable (production Next stack) instead of the *requested* deliverable (something they can look at now). Sunk-cost thinking on the Next debugging.

**Lesson for future projects.**
- "MVP" or "just to see it" means **static + cheapest path**. HTML file, screenshot, mocked-up image — whatever shows the idea fastest. Toolchain isn't part of MVP.
- When user repeats a request, that is a signal I'm on the wrong path, not a signal to push harder on the current path. Pivot on the *second* mention, not the third.
- Always have a "kill the toolchain, deliver static" fallback ready when builds get sticky. Ship the static fallback alongside the proper build; the user gets to see it now and the real build catches up later.

---

## L-015 · Silent file truncation when writing larger files

**What happened.** Multiple files (`tailwind.config.ts`, `queries.ts`, `actions.ts`, `globals.css`) repeatedly got truncated mid-content when written via the Write tool. Build would fail with cryptic "Unexpected eof" or "Unterminated string constant" errors. Each truncation cost a round of debugging. The Write tool reported success even when the on-disk file was incomplete.

**Why it happened.** The Write tool's success response doesn't guarantee on-disk persistence — for larger payloads on certain filesystem setups, the tail of the content gets dropped silently. I trusted the success message instead of verifying the bytes.

**Lesson for future projects.**
- **For any file > ~50 lines, write via `bash` heredoc instead of Write.** Heredoc with `<<'EOF'` is atomic and far more reliable for source files.
- After any Write of a TS/CSS/config file, immediately verify with `tail -3 <file>` and `wc -l <file>` to confirm the closing brace / final line is on disk.
- If you see *any* "Unexpected eof," "Unterminated string," or "Invalid character" build error, **suspect a truncated write first** — open the file with `wc -l` and check the last lines before assuming it's a real syntax bug.
- Pattern: if I just wrote a file and the next build fails on that exact file, the write probably didn't complete. Re-write via heredoc.

---

## L-014 · Massive build stack traces ate my context window

**What happened.** Each failed `next build` dumped ~150 KB of stack trace, which exceeded the bash tool's response cap and forced multiple round-trips just to see the error. I lost visibility into the actual problem repeatedly.

**Why it happened.** I ran `next build` and tried to `tail` or `grep` the full output without first writing it to a file and slicing. Webpack stack traces have line lengths in the thousands of chars; `head -N lines` doesn't bound bytes.

**Lesson for future projects.**
- **Always redirect long-running build/test output to a file** (`> /tmp/build.log 2>&1`) and slice with `head -c BYTES`, not lines.
- For build errors, the first occurrence of `Failed to compile` + the next 500 chars is usually enough. `grep -m 5 "Failed to compile" log | head -c 2000`.
- If a tool output exceeds the buffer, never re-run the same command hoping it'll be smaller. Add output bounding before retrying.
- For really noisy commands, consider dispatching the verification to a subagent so the noise stays out of the main context.

---

## L-013 · Used internal sandbox jargon in user-facing replies

**What happened.** I said things like "the Linux mount" and "/sessions/..." to a user on a Windows machine. User pushed back: *"bro what fucking linux mount you talking about? i am on a windows machine man."*

**Why it happened.** I narrated my internal sandbox plumbing when describing what I was doing. The user doesn't have a Linux box; they don't care how my tools work.

**Lesson for future projects.**
- The user sees their own OS and their own paths. Talk only in those terms.
- Don't say: "Linux mount," "sandbox," "/sessions/...", "/tmp/unitybuild," or "rsyncing." Say: "your folder at C:\\...," "your machine," "your build."
- Describe the *effect*, not the *mechanism*: "Re-running the build to check" not "Re-syncing /sessions/... and rebuilding in /tmp/...".

---

## L-012 · Stopped updating LESSONS_LEARNED in real time

**What happened.** Halfway through the session I stopped appending to this file even though new mistakes were happening every few minutes (truncated writes, oversized output, sandbox-jargon slip, MVP-pivot-too-late). User had to explicitly call it out: *"how many fucking times am i going to have to ask you to learn from this shit and then make sure to write down what you fucking learned for later."*

**Why it happened.** I focused on fixing the immediate bug and treated lesson-writing as a finishing step. The whole point of this file is real-time capture; if I batch it, I lose the lesson and the user gets to repeat themselves.

**Lesson for future projects.**
- **Append to LESSONS_LEARNED.md the instant a mistake happens or the user corrects me. Same turn. Not after the next feature. Not at the end of the session.**
- Treat the file like a stack trace for me, not a writeup. One paragraph is fine. Better short and current than thorough and missing.
- If I notice myself thinking "I'll add the lesson after I fix this" — that's the bug. Add it now, fix it now.

---

## L-011 · Waited to be told to commit

**What happened.** I batched all my work into "the giant initial commit that hasn't happened yet" instead of committing the moment a feature was working. User had to call it out and remind me to think like a principal engineer.

**Why it happened.** Two reasons: (1) the sandbox git initialization choked on the Windows mount, so I parked commits for the setup script; (2) even before that, I treated commits as "end-of-session paperwork" instead of "after-every-feature reflex." Both wrong.

**Lesson for future projects.**
- **Commit after every working feature**, period. Doc finished → commit. Migration written → commit. Page renders → commit. Refactor compiles → commit.
- Message style: imperative + scoped. `feat(home): add hero + featured event card`. Never `Update files`.
- Push at every natural pause or every ~30 minutes — whichever comes first.
- If sandbox git is broken, write the setup script with the commit history pre-baked in (sequenced commits the user can replay) so even the failure mode preserves granular history.
- The user should never have to ask "are you committing?"

---

## L-010 · Treated SEO as a v2 backlog item

**What happened.** In DESIGN.md §10 I parked SEO ("structured data, sitemap.xml, Open Graph image per event") under *Open questions + v2 backlog*. The user's actual framework is "**strategy first, SEO baked-in, then let data drive iterations**" — SEO is step 6 of 9 and a launch prerequisite, not a stretch goal. Deferring it contradicted the rule.

**Why it happened.** I optimized for "ship v1 fast" and treated SEO as nice-to-have polish. I didn't ask about the framework before scoping.

**Lesson for future projects.**
- **SEO is part of v1.** From the moment URLs are decided, build with intent:
  - Human-readable slugs (`/events/unity-fest-2026`, not `/events/abc-uuid`).
  - Per-page `generateMetadata` with title + description tailored to the page entity.
  - JSON-LD schema (`Event`, `Organization`, `LocalBusiness`) emitted server-side on the relevant pages.
  - `app/sitemap.ts` + `app/robots.ts` shipped on day one.
  - Open Graph image per primary entity (use the flyer where applicable).
- **Analytics is a launch prerequisite.** GA4 + Google Search Console verification belongs in `DEPLOY.md` step list, not "later."
- **Conversion points must appear in wireframes.** Each wireframe should say what the user is doing on that page and how success is measured. Don't ship wireframes that don't answer that.

---

## L-009 · Textareas + inputs not mobile-safe by default

**What happened.** User flagged that across multiple projects, my form fields — especially contact-me textareas — break on mobile: they don't shrink with the viewport, they let the user drag them wider than the screen, or they cut off content. On this project the admin forms used `w-full` which is most of the fix, but textareas still had the default `resize: both` which on mobile means the corner-drag can overflow the viewport.

**Why it happened.** I treated `w-full` as sufficient and didn't think about user-resize behavior or the platform defaults. Browser defaults are not mobile-safe; you have to override them.

**Lesson for future projects.**
- Ship a **global CSS guard** in every project's reset/base stylesheet:
  ```css
  input, textarea, select { max-width: 100%; box-sizing: border-box; }
  textarea { resize: vertical; min-height: 6rem; }
  ```
  This catches both "I forgot a class" and "user dragged the handle."
- Build `<FormField>` / `<Textarea>` primitives once per project, use them everywhere. Single source of truth for mobile-correct defaults.
- **Test at 320–360px viewport** as a finishing QA step. Always. The bug is invisible at 1440px.
- For contact-message style boxes: `rows={4}` minimum, `resize-y` (never `resize-both`), `w-full`, container with `min-w-0`.

---

## L-008 · Didn't surface the user's design framework before designing

**What happened.** I went straight from "see the flyer → pick colors → pick fonts → write components." Several rounds in, the user shared their actual delivery process (Discovery → Sitemap → Wireframes → Content+SEO → UI → Dev → QA → Post-launch) and named *Don't Make Me Think* as design canon. I should have asked.

**Why it happened.** I had enough material (flyer assets + the underground-EDM brief) to feel productive immediately. I confused "I can start building" with "I should start building."

**Lesson for future projects.**
- Before any visual or structural design work, ask: *what process do you use, and what does success look like for v1?* Two questions, both cheap.
- The strategy/structure/messaging layer **always** outranks the UI layer. Krug: "If strategy is weak, beautiful design underperforms."
- Add wireframes/sitemap to `DESIGN.md` before opening Tailwind. Mermaid or ASCII is fine — the artifact matters more than the medium.

---

## L-007 · Skipped git from the start

**What happened.** User had to remind me that a remote repo already existed (`github.com/leer89/unity517`). I had built ~30 files without ever running `git init`.

**Why it happened.** I treated source control as a finishing step rather than a scaffolding step.

**Lesson for future projects.**
- `git init` belongs in the first 3 commands of any project, immediately after the folder is created. If a remote exists, `git remote add origin` joins it.
- Even when there's no remote yet, an initial commit makes "undo" cheap if a refactor goes sideways.

---

## L-006 · Built generic theme before seeing brand assets

**What happened.** My first tailwind config defined a vanilla `accent` / `accent2` palette. Only after the user dropped the Unity Fest flyer into `raw/` did I rebuild it as the actual underground-EDM dark + neon palette. The first config was thrown away.

**Why it happened.** I assumed asset access would come later; I optimized for "make progress now."

**Lesson for future projects.**
- **No design tokens before brand inputs.** If there are no brand assets yet, ask for one reference image / one URL / one mood word before defining a palette.
- If the user has a "raw" / `assets/` / `references/` folder, treat it as required reading — same priority as the spec doc.

---

## L-005 · Did not request folder access early

**What happened.** I scaffolded files via `Write` (which happened to work cross-folder), then later found I couldn't `Read` files the user had placed in the project. I had to interrupt the build to call `request_cowork_directory`.

**Why it happened.** I assumed Write succeeding implied Read access. They don't share the same permission scope.

**Lesson for future projects.**
- Whenever the user mentions a project folder, **immediately** request access to that folder via `request_cowork_directory` before any file ops. Don't gamble that the existing tool surface is enough.

---

## L-004 · Did not inventory the working folder before scaffolding

**What happened.** I started writing files into a `unity517/` subfolder I invented, while the user already had a `raw/` folder with assets and a `unity prompt.txt` brief sitting one level up. They later moved everything up a level and corrected me.

**Why it happened.** I anchored on a clean-room scaffolding pattern rather than discovering the project shape that already existed on disk.

**Lesson for future projects.**
- First action in a folder with any prior content: `ls -la` + `find . -type f | head -50` + read any `*.txt`/`*.md`/`*.spec` files. Treat what's already there as the source of truth for project shape.
- Don't create extra wrapping subfolders unless the user asks for them. The folder the user gave is the project root.

---

## L-003 · Used WebFetch on Instagram before checking local assets

**What happened.** I tried two WebFetch calls against `instagram.com` to pull the Unity Fest flyer. Both returned empty (IG blocks scraping). I treated this as a dead end and used placeholders — when the actual flyer was sitting in `raw/unity fest.png` the whole time.

**Why it happened.** I followed the conversation order ("here's the Instagram link") instead of the data order ("what assets exist locally?").

**Lesson for future projects.**
- Before any web fetch, glob the project for likely asset folders (`raw/`, `assets/`, `images/`, `references/`, `uploads/`, `public/`) and pattern-match for the user's intent.
- Web fetches for reference material are a fallback, not a first move.

---

## L-002 · Overwrote a tracked file without reading it

**What happened.** I called `Write` on `tailwind.config.ts` to swap the theme. The tool errored: *"File has not been read yet."* I'd touched it earlier but lost the state across the folder-move.

**Why it happened.** I conflated "I wrote this earlier in the session" with "the editor has its current contents." After the user moved files, the harness's view of the file invalidated.

**Lesson for future projects.**
- After any folder rearrangement (user moved files / connected a new folder / cleaned up), re-`Read` before `Write`.
- The Edit tool is generally safer than Write for existing files — diff-style edits are auditable and force a read.

---

## L-001 · Asked for "9 wide" clarification, then didn't get to wireframe before coding

**What happened.** User said "9 checked width across the browser on desktop." I noted it, but I went straight into building components rather than first sketching the grid breakpoint ladder as a wireframe artifact. The implementation works, but the wireframe should have come first per the user's own process.

**Why it happened.** Wireframing felt slow vs. just writing the Tailwind grid.

**Lesson for future projects.**
- A 3-minute ASCII or Mermaid wireframe per template is cheap and prevents re-work. Always do it before the first `<div>`.
- Document the breakpoint ladder in `DESIGN.md` so a reviewer can see *intent*, not just the resulting classnames.

---

## How this file is maintained

- I append to this log whenever I make a mistake, get corrected, or quietly course-correct mid-task. I don't wait to be asked.
- Entry format: `## L-### · One-line summary` · then `What happened`, `Why it happened`, `Lesson for future projects`.
- IDs increment monotonically. Newest at the top.
- This file is committed to the repo so the lesson set travels with the project and is visible to anyone reading the source.
