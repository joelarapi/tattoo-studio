# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Project brief

- Full build spec: `docs/BUILD_SPEC.md`. Its phases 6–8 (lead capture, SEO, QA) still apply. After each phase run `pnpm build` and `pnpm lint`, fix everything, and check in with the user before continuing.
- **Design source:** `docs/design/`, the approved design (static HTML/CSS from the design review). It replaces the spec's look, homepage sections and route list (§2–4, §11). Its README lists what isn't built and what deliberately differs.
- Content and accounts still needed from the studio: `docs/RESOURCES_NEEDED.md`.
- The client is a real studio, **London InkTattoo in Fier, Albania**, with one artist, **Tisi** (18 years). Real content comes later. Keep everything editable in the CMS and never hard-code business facts: the name, city, artist and numbers live in the CMS and the seed only.
- Ask before adding any dependency the spec doesn't list.

## Branches and databases

- `main` is production (Vercel deploys it). Other branches get preview deployments.
- `design-v1` keeps the previous design (scroll-sequence animation, GSAP slider, text effects). It uses the **original** Neon database branch.
- `redesign` is the new design. It uses the Neon branch **`redesign`**, which starts with an empty schema and is filled by `pnpm seed`.
- **`.env` `DATABASE_URI` must match the checked-out git branch.** `pnpm dev`/`pnpm seed` push the schema, so running one branch's code against the other's database drops that database's columns.
- Before running anything that touches the database after switching, compare the host in `DATABASE_URI` (print a hash, never the string).
- Both databases' media documents point at the same R2 objects. **Never delete media documents** while both are in use: the storage plugin deletes the file from R2.
- Schema-push prompts (renames, data loss) need an interactive terminal, so the agent's shell can't answer them. Ask the user to run `pnpm dev` and answer, or, on a disposable branch, empty the schema and reseed.
- At switch-over: point Vercel Production `DATABASE_URI` at the `redesign` Neon branch, merge into `main`, redeploy, re-create the client's CMS user.

## Decisions so far

- **Database:** Neon Postgres, pooled connection string in `DATABASE_URI`. No local Postgres or Docker on this machine.
- **Node:** pinned per project to 24.22.2 via `devEngines.runtime` in `package.json`, because Payload 3.92 needs ≥22.23.4 and the system Node is 22.19. Run everything through `pnpm` / `pnpm exec` / `pnpm dlx`, not plain `npx`. The pnpm "Unsupported engine" warning is harmless.
- **Versions:** Payload 3.92.1, Next.js 16.3.3 (Payload's supported range is >=16.3.3 <17).
- **Code location:** code lives under `src/` (Payload's layout), not the repo root shown in the spec's tree.
- **Routes:** one map in `src/lib/routes.ts` (`PAGE_GLOBALS`, `pathForDoc`, `ENQUIRY_ID`). Rich-text links, SEO URLs, revalidation and preview paths all use it. Pages: `/`, `/about`, `/portfolio`, `/portfolio/[slug]`, `/visiting-albania`, `/journal`, `/journal/[slug]`, `/contact`, and `/[...slug]` for legal pages.
- **404s:** `(frontend)` and `(payload)` are separate root layouts, so there's no app-wide `not-found`. The `[...slug]` catch-all serves `/privacy` and `/cookies` and calls `notFound()` for everything else, so every 404 renders `(frontend)/not-found.tsx` inside the site layout. It checks one cached slug list, so junk URLs never hit the database.
- **Page copy:** each page has a global in the admin group "Pages", built with `pageGlobal()` (`src/globals/pageGlobal.ts`): drafts with autosave, live preview, revalidation and the plugin's SEO tab. Field helpers: `styledHeading()` (white / grey / orange parts, rendered by `<StyledHeading>`), `cardList()`, `pageHero()` and `linkList()` in `src/fields/`. Section and card numbers ("01 / …") are added by the site, not typed.
- **Shared copy:** the closing call to action (About, Portfolio, Journal, articles) and the 404 copy are in Studio details → Shared sections. The enquiry form's button and notes are in Pages → Contact → Form, also used on the homepage.
- **Collections after the redesign:**
  - `styles` are portfolio categories (the filter).
  - `portfolio-items` have slugs, a summary, a story and an SEO tab. Each gets its own page, and the card number is its position in CMS order.
  - FAQs pick their pages with `pages` (home / contact / visiting).
  - `artists` has no pages of its own; Homepage and About pick an artist.
- **Tailwind v4 tokens:** in `src/app/(frontend)/globals.css`, taken from the design.
  - Breakpoints are mobile-first: `md` 681px, `lg` 1001px, `2xl` 1700px.
  - Layout: `px-site` (6% / 5% / 7%, capped at 1450px wide) and `py-section`.
  - Type: `text-display`, `text-hero`, `text-h2*`, `text-cta`, `text-h3`.
  - Labels and links: `label*`, `tag`, `btn btn-accent|btn-outline`, `link-plain`, `link-text`.
  - Surfaces and photos: `grid-bg`, `framed`, `photo`.
  - Custom `@utility` classes come before single-property utilities in the CSS, so e.g. `mb-2.5` overrides `tag`'s margin. Form-row grids need `grid-cols-1` on mobile.
- **Fonts:** Inter (next/font) for labels, buttons and nav. Headings and body use the system Arial/Helvetica, as in the design.
- **Accent:** `#FF5100`. Text on it is black (`--color-on-accent`), the user's choice for WCAG AA; the design uses white (3.3:1). Small grey labels use `--color-faint` #8F8F8F, not the design's #666.
- **Glyphs:** `✳` and `▶` are SVGs (`components/art/Glyphs.tsx`), because iOS draws them as emoji. Text arrows get VS15 (`↗︎`).
- **Photos:** black and white through the `photo` utility, unless Studio details → "Show photos in black and white" is off (`data-mono-photos` on `<html>`). `CmsImage` adds it by default (`photo={false}` for logos).
- **Motion:** no GSAP or Lenis (they stay on `design-v1`). `PageMotion` (in the layout) handles all of it with IntersectionObservers:
  - `data-reveal` fades content up once.
  - `data-reveal-group` staggers siblings by (index % 3) × 65 ms.
  - `data-stencil` SVG line art draws in.
  - It sets `motion-ready` for the layout's `jsReadyScript`, and rescans on navigation and DOM changes (live preview).
  - Never put `data-reveal` on hero/LCP content.
  - Also: `HeroParallax` and `MobileCta` on the homepage only; native smooth scrolling with `data-scroll-behavior="smooth"`.
- **Horizontal galleries:** `ScrollTrack`, a native scroll-snap row with prev/next buttons. No autoplay, by design.
- **Enquiry form:** `EnquiryForm` is UI only until the lead-capture phase; submitting shows `pendingNotice`.
  - Travel fields show with CSS `:has(#travelling:checked)`, so they work without JS.
  - `?travel=1` and `?project=<slug>` are read with `useSyncExternalStore`, not `useSearchParams`, which would need a Suspense boundary on prerendered pages.
  - `leads` fields already match the form.
  - Uploads must go straight to the private R2 bucket in that phase (Vercel's 4.5 MB request limit).
- **Email:** Resend (`@payloadcms/email-resend`), used only when `RESEND_API_KEY` is set. No SMTP.
- **Post authors:** `posts.author` links to `artists` (for E-E-A-T). If it's empty, the studio gets the credit. CMS users are logins only.
- **Leads export:** none for now (the user's choice). If it's wanted later, `@payloadcms/plugin-import-export` is the option, and it needs approval.
- **Lead reference files:** a separate `lead-attachments` upload collection (photos and videos; only admins and editors can read it), stored in a private R2 bucket (`S3_PRIVATE_BUCKET`) rather than in `media`, because R2 public access is per bucket.
- **Landing pages:** the `landing-pages` collection is built in Phase 6, together with `/lp/[slug]`.
- **SEO fields:** collections place them by hand with `seoTab()` (`src/fields/seo.ts`). Page globals get them from the plugin (`globals: pageGlobalSlugs`), because the plugin's generate endpoints need that; the generate functions switch on `globalConfig?.slug ?? collectionConfig?.slug`. `meta.title` holds the full title: `pageMetadata()` (`src/lib/metadata.ts`) renders it with `title.absolute`, falling back to the title template.
- **Caching:** tags are `collection:<slug>` and `global:<slug>` (`src/lib/cache-tags.ts`). Each fetcher tags every collection it reads, including populated relations, `media`, and the collections rich text can link to. Hooks call `revalidateTag(tag, { expire: 0 })` (Next 16 requires the second argument). Outside a request they fall back to `POST /api/revalidate`.
- **Data caching:** `unstable_cache` with tags (`src/lib/data.ts`), not `'use cache'`, because that needs Cache Components, which would change every route including Payload's admin. In draft mode the cache is skipped and drafts are read. Outside draft mode post fetchers filter `_status: published` (the Local API skips access control).
- **Scheduled publishing:** runs as Payload jobs. `autoRun` checks every minute, except on Vercel, where a cron in `vercel.json` calls the job runner with `CRON_SECRET`. The cron is daily (`0 6 * * *`) because Vercel Hobby fails deploys with anything more frequent. Switch to `* * * * *` on Pro.
- **Demo hosting:** Vercel Hobby (the user's choice, for sharing a demo with the client; Netlify was considered and dropped). Functions are pinned to `fra1` in `vercel.json` because Neon is in `eu-central-1`. `NOINDEX=true` adds `X-Robots-Tag: noindex` (`next.config.ts`). Flagged to the user: Hobby terms are non-commercial only, so the launch needs Pro, the studio's own account, or a VPS.
- **Storage schema:** both `s3Storage` plugins use `alwaysInsertFields: true`, so `prefix`/`_objectKey` columns exist with or without R2. Production never pushes the schema, so without this, turning on R2 would break every media query. `pnpm media:to-r2` (`scripts/media-to-r2.ts`) re-uploads local files into R2. Local `.env` has the `S3_*` vars, so the seed uploads straight to R2.
- **Orderable lists:** styles, portfolio, artists and FAQs use `orderable: true` (sorted by `_order`). The seed creates them one at a time, because `_order` follows creation order.
- **next/image in Next 16:** `priority` is deprecated. Use `loading="eager"` + `fetchPriority="high"` (or `preload`), on one image per page at most.
- **Favicon:** none yet (the 404 in the console). It comes with the logo in Phase 7.

## Status

- **Phases 1–4** (scaffold, CMS, scroll sequence, homepage) are done and preserved on `design-v1`.
- **Redesign: in progress on `redesign`.** Covers all pages from `docs/design/`, the reworked CMS model (page globals, portfolio pages, FAQ pages, lead fields), seed content for London InkTattoo, and the removal of GSAP, Lenis and the scroll sequence. It replaces the old Phase 5 (journal, artist and style pages).
- **Next:** Phase 6 (lead capture: sending the enquiry form, Turnstile, Resend, UTM, consent), then 7 (SEO: sitemap, robots, LocalBusiness JSON-LD, favicon) and 8 (QA).
- **Open for later:** the footer has no newsletter in the new design (dropped). `.env` uses `sslmode=require`; `verify-full` behaves the same and silences pg's warning.
- **Secrets:** they go in `.env` only. The user once pasted the DB string into `.env.example` (which is committed); it was caught before any push. Before every commit, check that `.env.example` contains only placeholders.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
