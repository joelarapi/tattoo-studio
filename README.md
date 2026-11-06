# Tattoo studio website

Next.js 16 (App Router) + Payload CMS 3 + Postgres (Neon). The full brief is in [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md), and the content and accounts still needed from the studio are listed in [docs/RESOURCES_NEEDED.md](docs/RESOURCES_NEEDED.md).

> Work in progress: Phases 1–4 are done (scaffold, CMS, scroll animation, homepage). The journal, artist and style pages come next. Until then, links to them 404.

## Developer setup

**Requirements:** pnpm 10. You don't need to install Node 24 yourself: `package.json` pins Node 24.22.2 via `devEngines.runtime`, and pnpm downloads it and uses it for every `pnpm …` script. If your system Node is older than 22.23.4, pnpm prints an "Unsupported engine" warning; it's harmless, and updating your system Node removes it.

1. `pnpm install`
2. Copy `.env.example` to `.env` and fill in at least `DATABASE_URI` (Neon **pooled** connection string), `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `REVALIDATE_SECRET` and `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
3. `pnpm seed` creates the tables (in development Payload pushes the schema automatically), the admin user and placeholder content.
4. `pnpm dev`, then open http://localhost:3000 (site) and http://localhost:3000/admin (CMS).

| Script                                 | What it does                                         |
| -------------------------------------- | ---------------------------------------------------- |
| `pnpm dev`                             | Dev server                                           |
| `pnpm build && pnpm start`             | Production build and server                          |
| `pnpm lint`                            | ESLint                                               |
| `pnpm format`                          | Prettier (with Tailwind class sorting)               |
| `pnpm generate:types`                  | Regenerate `src/payload-types.ts`                    |
| `pnpm generate:importmap`              | Regenerate the admin import map                      |
| `pnpm seed`                            | Add placeholder content (safe to rerun)              |
| `pnpm media:to-r2`                     | Copy locally stored uploads into R2 (safe to rerun)  |
| `pnpm test:int`                        | Access-control integration tests                     |
| `pnpm sequence:placeholder`            | Regenerate the placeholder process animation         |
| `pnpm sequence:extract <video> <name>` | Turn a video into a process animation (needs ffmpeg) |

Always use `pnpm exec` / `pnpm dlx` rather than plain `npx`, so commands run on the pinned Node.

## Deploying to Vercel

1. **Media must be in R2 first.** Vercel has no persistent disk and `/media` isn't in git. Create the two R2 buckets, put the `S3_*` variables in your local `.env` as well, then run `pnpm media:to-r2`. Running it also adds any missing storage columns to the database (dev schema push), which production can't do by itself.
2. Import the GitHub repo in Vercel. The framework (Next.js) and pnpm are detected automatically. Under Settings → Build and Deployment, check that the Node.js version is 24.x.
3. Add every variable from `.env`. Set `NEXT_PUBLIC_SITE_URL` to the exact production URL (for example `https://<project>.vercel.app`): it's baked in at build time and live preview needs it to match. Set `NOINDEX=true` for a demo.
4. Functions run in `fra1` (Frankfurt, `vercel.json`), next to the Neon database in `eu-central-1`.
5. Add the production URL to the R2 bucket's CORS rule (`PUT`, `GET`), next to `http://localhost:3000`.

Local and deployed sites share the same database until launch. Schema changes reach it through `pnpm dev`, so redeploy after changing collections.

## Design system

- Tokens live in `src/app/(frontend)/globals.css` (`@theme`). The accent is `--color-accent` and changes everywhere from that one line.
- Text on the accent uses `--color-on-accent` (black by default, for WCAG contrast).
- Layout utilities: `px-site-margin`, `max-w-site`, `py-section`, `py-section-lg`, `gap-gutter`, `h-nav`; labels: `mono-label`, `mono-label-sm`.
- Primitives in `src/components/ui/`: `Button`, `Eyebrow`, `Container`, `SectionHeading`, `CornerTicks`, `GridLines`, `CmsImage` (CMS uploads with alt text and focal point), `Icon` (the line icons editors pick in the CMS) and `Logo`.
- Motion helpers in `src/components/motion/`:
  - `SplitReveal`: headings flicker in, paragraphs unscramble.
  - `LineArt`: SVG that draws itself in.
  - `DrawLines`: grid hairlines that draw in.
  - `DashedBeam`: beams of light travelling along line art (pure CSS).
  - `FadeReveals`: a single page-wide listener that fades in any element marked `data-reveal data-fade`.
- Pre-animation states use `data-reveal` and are only applied once JS has loaded (`html.js-ready`) and only when motion is allowed, so text is never hidden without JS.
- Line art is original SVG in `src/components/art/`. The navigation stays free of line art.
- Motion: `MotionProvider` (GSAP core + Lenis) in `src/components/motion/`. Heavier GSAP plugins are registered only inside the components that use them.

## Homepage

`src/app/(frontend)/page.tsx` renders the sections in `src/components/home/` in this order:

1. Hero
2. Process (scroll animation)
3. Featured work slider
4. Styles grid
5. Studio in numbers
6. Statement
7. Artists
8. Standards
9. Journal
10. FAQ (with FAQPage structured data)
11. Booking form

The nav and footer are in `src/components/layout/`. Every text comes from the CMS, and the data functions are in `src/lib/data.ts`.

- **Section anchors** for CMS links: `#process #work #styles #numbers #studio #artists #standards #journal #faq #book`.
- **Menus and the FAQ** use `<details>`, so they work without JS. Script adds Escape, outside-click, arrow keys and scroll locking.
- **The slider** is a native, swipeable scroll-snap row without JS. With JS it becomes a GSAP Draggable slider with autoplay; a pause button is shown, and autoplay is off for reduced motion.
- **Not connected yet:** the booking form submits in Phase 6, and the newsletter form has no backend yet (to be decided). For now, both show a notice instead of sending anything.

## Process animation (scroll sequence)

The "process" section plays a short clip frame by frame as you scroll (`src/components/scroll-sequence/`). It uses still frames instead of a `<video>`, because frames scrub reliably on iOS Safari and Firefox. Test it at `/dev/sequence` (a test page that must be removed before launch).

**Footage brief:** 6–10 seconds, at least 1080p, rendered or shot on a **pure black background**, subject centred, with **no text** in the video (the step text is real HTML on top, for SEO and accessibility). Ideally it shows four moments: consultation → design → stencil and ink → healed result. Keep the subject inside the middle 45% of the width, because phones show a centre crop.

**Swapping in new footage:**

1. Install ffmpeg once (Windows: `winget install Gyan.FFmpeg`, macOS: `brew install ffmpeg`).
2. Run `pnpm sequence:extract path/to/clip.mp4 process-v1`. This writes `public/sequences/process-v1/`:
   - desktop frames, 1920 wide, at 24 fps (up to 180 frames)
   - mobile frames, every 2nd frame, 960×1200 centre crop
   - each frame as AVIF with a WebP fallback, plus `poster.avif` and `manifest.json`

   It also turns near-black pixels pure black so the edges disappear into the page.

3. In the CMS, set Homepage → Process → "sequence" to `process-v1` (admins only), then publish.

`pnpm sequence:placeholder` regenerates the placeholder (numbered frames with an expanding ring) that's used until real footage exists.

**How it behaves:**

- **Loading:** frames start loading when the section is about one screen away: frame 1, then every 8th, 4th and 2nd frame, then the rest, six at a time. Until a frame arrives, the nearest loaded one is shown.
- **Before frames arrive:** the poster is a normal image (the LCP element). The canvas fades in over it once frames decode.
- **Save-Data, reduced motion, no JavaScript:**
  - With **Save-Data** on, no frames load and the poster stays.
  - With **reduced motion**, there's no scrubbing: just the poster and the four steps as a plain list.
  - **Without JavaScript**, the poster and all step text are visible.

## CMS (Payload)

- Config: `src/payload.config.ts`. Collections are in `src/collections/`, globals in `src/globals/`, access rules in `src/access/` and shared fields in `src/fields/`.
- **Roles:** `admin` can do everything. `editor` can manage all content and read booking requests, but can't change or delete them, manage users or change tracking IDs. The first account created at `/admin` becomes an admin.
- **Drafts and scheduling:** journal posts and the homepage have drafts and autosave, and posts can also be scheduled. Scheduled publishes run as Payload jobs. On a Node server, Payload checks for them every minute. On Vercel, `vercel.json` has a cron that calls `/api/payload-jobs/run` with `CRON_SECRET`. It runs once a day (06:00 UTC) because Vercel Hobby rejects anything more frequent. On Pro, change the schedule to `* * * * *`.
- **Live preview:** `/api/preview` needs `PREVIEW_SECRET` and a logged-in CMS session, then turns on Next.js draft mode. `/api/exit-preview` turns it off. While in draft mode, pages mount `src/components/LivePreviewListener.tsx`.
- **Revalidation:** every collection and global calls `src/hooks/revalidate.ts` after published changes. Data fetchers must tag their caches with the tag of **every** collection they read (`src/lib/cache-tags.ts`). Code running outside a request (the job runner) revalidates through `POST /api/revalidate` with `REVALIDATE_SECRET`.
- **Media storage:** local disk in development: `/media`, plus `/media-private` for booking reference images. In production, set the `S3_*` variables for Cloudflare R2. `S3_BUCKET` is public: set `S3_PUBLIC_URL` to its r2.dev or custom-domain URL. `S3_PRIVATE_BUCKET` must **not** be public. Uploads go straight from the browser to R2, so the public bucket needs a CORS rule that allows `PUT` from the site's origin. The storage plugin's columns (`prefix`, `_objectKey`) exist whether or not R2 is on (`alwaysInsertFields`), so the schema doesn't change between environments. `pnpm media:to-r2` copies files already uploaded to local disk into R2.
- **Email:** Resend, when `RESEND_API_KEY` is set. `EMAIL_FROM_ADDRESS` must be on a domain verified in Resend. Without a key, emails are printed to the console.
- **Schema changes:** development uses Payload's automatic schema push. Before launch, production switches to migrations (`payload migrate:create` / `payload migrate`) on a separate Neon branch.

## For editors: where things live in the CMS

Log in at `/admin`. The menu on the left has four groups:

- **Content:** journal posts, journal categories, images and videos, and the homepage (every piece of text on it, section by section).
- **Studio:** artists, tattoo styles, portfolio and FAQs. To change the order they appear on the site, drag rows in the list.
- **Leads:** booking requests from the website form, showing which ad campaign each one came from, and the reference images clients attached.
- **Settings:** legal pages (privacy and cookies), CMS users, studio details (name, address, opening hours, social links and default Google text) and menus.

Journal posts and the homepage save a draft automatically while you type. Nothing changes on the website until you press **Publish**. To publish on a later date, use the arrow next to Publish. The eye icon at the top opens a live preview next to the form, and you can switch between Mobile and Desktop above the preview.

Every post, artist and style has an **SEO** tab. Click "Auto-generate" to fill in the Google title and description, then adjust them. The preview shows roughly how the page will look in Google.

Everything there now is placeholder text and images. Replace it with the real details before launch, especially what Google shows: the address, phone number, opening hours and the numbers on the homepage.
