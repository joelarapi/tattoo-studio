# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Project brief

- Full build spec: `docs/BUILD_SPEC.md`. Follow its 8 phases in order. After each phase run `pnpm build` and `pnpm lint`, fix everything, and check in with the user before continuing.
- Content and accounts still needed from the studio: `docs/RESOURCES_NEEDED.md`.
- This is a real tattoo studio in Tirana, but its real content comes later. Use realistic placeholder content, keep everything editable in the CMS, and never hard-code business facts.
- Ask before adding any dependency the spec doesn't list.

## Decisions so far

- **Database:** Neon Postgres. The connection string goes in `DATABASE_URI` (pooled string). No local Postgres or Docker on this machine.
- **Node:** pinned per project to 24.22.2 via `devEngines.runtime` in `package.json`, because Payload 3.92 needs ≥22.23.4 and the system Node is 22.19. Run everything through `pnpm` / `pnpm exec` / `pnpm dlx`, not plain `npx`. The pnpm "Unsupported engine" warning is harmless.
- **Versions:** Payload 3.92.1, Next.js 16.3.3 (Payload's supported range is >=16.3.3 <17).
- **Code location:** code lives under `src/` (Payload's layout), not the repo root shown in the spec's tree.
- **Tailwind v4 tokens:** in `src/app/(frontend)/globals.css`. Spacing and container token names must not collide: `max-w-*` checks `--spacing-*` first, which is why the side gutter is `px-site-margin` and the max width is `max-w-site`.
- **Accent buttons:** use `--color-on-accent` (black) for text. White on #FF4800 fails WCAG AA; the alternative is darkening the accent to about #D93D00. This is flagged to the user.
- **GSAP:** only core plugins (ScrollTrigger, CustomEase "studio") are registered globally in `src/lib/motion/gsap.ts`. Other plugins are registered inside the components that use them.
- **Slider:** GSAP Draggable + InertiaPlugin, not Embla.
- **Placeholder frames:** the placeholder frame sequence is generated with sharp, not node-canvas. ffmpeg is installed only when real footage arrives (`winget install Gyan.FFmpeg`).
- **Privacy page:** CMS-editable through the `legal-pages` collection (seeded with `privacy` and `cookies`). The `/privacy` and `/cookies` routes come in Phase 5.
- **Email:** Resend (`@payloadcms/email-resend`), used only when `RESEND_API_KEY` is set. No SMTP.
- **Post authors:** `posts.author` links to `artists` (for E-E-A-T). If it's empty, the studio gets the credit. CMS users are logins only.
- **Leads export:** none for now (the user's choice). If it's wanted later, `@payloadcms/plugin-import-export` is the option, and it needs approval.
- **Lead reference images:** a separate `lead-attachments` upload collection (only admins and editors can read it), stored in a private R2 bucket (`S3_PRIVATE_BUCKET`) rather than in `media`, because R2 public access is per bucket.
- **Landing pages:** the `landing-pages` collection is built in Phase 6, together with `/lp/[slug]`.
- **SEO fields:** collections place them by hand with `seoTab()` (`src/fields/seo.ts`). The homepage gets them from the plugin (`globals: ['homepage']`), because the plugin's generate endpoints need that. `meta.title` holds the full title, so render it with `title.absolute`.
- **Caching:** tags are `collection:<slug>` and `global:<slug>` (`src/lib/cache-tags.ts`). Each fetcher tags every collection it reads, including populated relations and `media`. Hooks call `revalidateTag(tag, { expire: 0 })` (Next 16 requires the second argument). Outside a request they fall back to `POST /api/revalidate`.
- **Scheduled publishing:** runs as Payload jobs. `autoRun` checks every minute, except on Vercel, where a cron in `vercel.json` calls the job runner with `CRON_SECRET`. The cron is daily (`0 6 * * *`) because Vercel Hobby fails deploys with anything more frequent. Switch to `* * * * *` on Pro.
- **Demo hosting:** Vercel Hobby (the user's choice, for sharing a demo with the client; Netlify was considered and dropped). Functions are pinned to `fra1` in `vercel.json` because Neon is in `eu-central-1`. `NOINDEX=true` adds `X-Robots-Tag: noindex` (`next.config.ts`). Flagged to the user: Hobby terms are non-commercial only, so the launch needs Pro, the studio's own account, or a VPS.
- **Storage schema:** both `s3Storage` plugins use `alwaysInsertFields: true`, so `prefix`/`_objectKey` columns exist with or without R2. Production never pushes the schema, so without this, turning on R2 would break every media query. `pnpm media:to-r2` (`scripts/media-to-r2.ts`) re-uploads local files into R2. Because the database is shared, local `.env` needs the `S3_*` vars too, once R2 is in use.
- **Orderable lists:** artists, styles, portfolio and FAQs use `orderable: true` (sorted by `_order`) instead of a number field.
- **Placeholder studio name:** "Linja Tattoo Studio", set in `site-settings` only.
- **Sequence frames:** ffmpeg only decodes (24 fps, at most 180 frames, near-black crushed to black); sharp resizes and encodes (`scripts/sequence/encode.ts`). Mobile frames are a 960×1200 (4:5) centre crop rather than 16:9, so portrait phones stay sharp at DPR 1. The manifest has per-set counts and sizes, plus `fallbackExt` and `poster`.
- **Sequence layout:** the steps are real HTML in rows sized to each step's quarter of the scroll. On desktop they scroll past on the left. On mobile they dock at the bottom (`position: sticky`), and with JS only the active step shows. No JS still works, because all the layout is CSS. Reduced motion is handled by CSS too (`motion-reduce:` gives a stacked list), so there's no layout shift.
- **next/image in Next 16:** `priority` is deprecated. Use `loading="eager"` + `fetchPriority="high"` (or `preload`). `/sequences/**` is in `images.localPatterns`.
- **Favicon:** none yet (the 404 in the console). It comes with the logo in Phase 7.
- **Data caching:** `unstable_cache` with tags (`src/lib/data.ts`), not `'use cache'`, because that needs Cache Components, which would change every route including Payload's admin. In draft mode the cache is skipped and drafts are read. Verified: a published edit appears on the static homepage within a second, and a draft save doesn't change it.
- **LCP:** the hero H1 is painted immediately (`SplitReveal hideUntilPlayed={false}`) and flickers once JS loads. The process poster on the homepage isn't high priority, because it's below the fold.
- **Nav:** the scrolled backdrop is its own layer, and the entrance animation is opacity only. A filter or transform on the header would trap the fixed mobile menu inside it.
- **Tailwind:** custom `@utility` classes (`mono-label*`) come before single-property utilities in the CSS, so `text-label-sm` and `normal-case` override them. Grids that hold form rows need `grid-cols-1` on mobile, or an input's built-in width forces overflow (Lenis `overflow: clip` hides it from scrollWidth checks).

## Status

- **Phase 1 (scaffold): done.** Tokens, fonts, MotionProvider (GSAP + Lenis), and the Button / Eyebrow / Container primitives. `/` is a temporary design-system preview.
- **Phase 2 (CMS model + seed): done.** 11 collections and 3 globals, roles, the SEO plugin, drafts, autosave and scheduling, live preview (`/api/preview`), revalidation hooks, an idempotent `pnpm seed` and access tests (`pnpm test:int`). Neon is seeded. The frontend pages aren't wired to the CMS yet (Phases 4 and 5).
- **Phase 3 (ScrollSequence): done.** Frame scripts, placeholder sequence (`public/sequences/placeholder`, 7 MB, committed), `<ScrollSequence>`, `<SplitReveal>`, and the test route `/dev/sequence` (**remove before launch**). Real footage can arrive at any time; swapping it needs no code changes (README → Process animation).
- **Phase 4 (homepage sections 1–13): done.** All sections are wired to the CMS through `src/lib/data.ts`, with nav, footer, line art and motion. The booking and newsletter forms show a notice until Phase 6 (and a decision on the newsletter). `/dev/design` (the Phase 1 preview) and `/dev/sequence` are test pages to **remove before launch**.
- **Phase 5 (journal, artist and style pages): next.** Wait for the user's go-ahead. Until then, links to those pages and to /privacy and /cookies 404, and Next's prefetches log console errors.
- **Open for later:** the spec gives the footer newsletter no backend; decide in Phase 4 or 6. `.env` uses `sslmode=require`. `verify-full` behaves the same and silences pg's warning.
- **Secrets:** they go in `.env` only. The user once pasted the DB string into `.env.example` (which is committed); it was caught before any push. Before every commit, check that `.env.example` contains only placeholders.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
