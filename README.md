# London InkTattoo website

Next.js 16 (App Router) + Payload CMS 3 + Postgres (Neon), for London InkTattoo in Fier, Albania. The approved design is in [docs/design/](docs/design/), the original brief in [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md), and the content and accounts still needed from the studio in [docs/RESOURCES_NEEDED.md](docs/RESOURCES_NEEDED.md).

> Work in progress. All pages are built; the enquiry form doesn't send yet (lead-capture phase). The previous design, with the scroll animation, is kept on the `design-v1` branch.

## Developer setup

**Requirements:** pnpm 10. You don't need to install Node 24 yourself: `package.json` pins Node 24.22.2 via `devEngines.runtime`, and pnpm downloads it and uses it for every `pnpm …` script. If your system Node is older than 22.23.4, pnpm prints an "Unsupported engine" warning; it's harmless, and updating your system Node removes it.

1. `pnpm install`
2. Copy `.env.example` to `.env` and fill in at least `DATABASE_URI` (Neon **pooled** connection string), `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `REVALIDATE_SECRET` and `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
3. `pnpm seed` creates the tables (in development Payload pushes the schema automatically), the admin user and the starting content.
4. `pnpm dev`, then open http://localhost:3000 (site) and http://localhost:3000/admin (CMS).

**One database per CMS schema.** `redesign` (soon `main`) and the old `design-v1` have different CMS schemas. The production Neon database now holds the redesign's. To run `design-v1`, give it its own Neon branch with an empty schema and run `pnpm seed` there. When you switch git branches, switch `DATABASE_URI` in `.env` too: `pnpm dev` and `pnpm seed` push the current code's schema and would drop the other schema's columns.

| Script                     | What it does                                        |
| -------------------------- | --------------------------------------------------- |
| `pnpm dev`                 | Dev server                                          |
| `pnpm build && pnpm start` | Production build and server                         |
| `pnpm lint`                | ESLint                                              |
| `pnpm format`              | Prettier (with Tailwind class sorting)              |
| `pnpm generate:types`      | Regenerate `src/payload-types.ts`                   |
| `pnpm generate:importmap`  | Regenerate the admin import map                     |
| `pnpm seed`                | Add the starting content (safe to rerun)            |
| `pnpm media:to-r2`         | Copy locally stored uploads into R2 (safe to rerun) |
| `pnpm test:int`            | Access-control integration tests                    |
| `pnpm test:e2e`            | Page, 404, form and no-JS checks (Playwright)       |

Always use `pnpm exec` / `pnpm dlx` rather than plain `npx`, so commands run on the pinned Node.

## Deploying to Vercel

1. **Media must be in R2 first.** Vercel has no persistent disk and `/media` isn't in git. Create the two R2 buckets, put the `S3_*` variables in your local `.env` as well, then run `pnpm media:to-r2` (or seed with them set). Running it also adds any missing storage columns to the database (dev schema push), which production can't do by itself.
2. Import the GitHub repo in Vercel. The framework (Next.js) and pnpm are detected automatically. Under Settings → Build and Deployment, check that the Node.js version is 24.x.
3. Add every variable from `.env`. Set `NEXT_PUBLIC_SITE_URL` to the exact production URL (for example `https://<project>.vercel.app`): it's baked in at build time and live preview needs it to match. Set `NOINDEX=true` for a demo.
4. Functions run in `fra1` (Frankfurt, `vercel.json`), next to the Neon database in `eu-central-1`.
5. Add the production URL to the R2 bucket's CORS rule (`PUT`, `GET`), next to `http://localhost:3000`.
6. Preview deployments of other branches use the Preview variables. A branch with its own database (like `design-v1`) needs its own `DATABASE_URI` and `NEXT_PUBLIC_SITE_URL`, scoped to that branch.

Schema changes reach a database through `pnpm dev` or `pnpm seed`, so run one against it before deploying code that changes collections.

## Pages

| Route                  | Content from (CMS)                                 |
| ---------------------- | -------------------------------------------------- |
| `/`                    | Pages → Homepage, plus portfolio, FAQs and journal |
| `/about`               | Pages → About, plus the chosen artist's bio        |
| `/portfolio`           | Pages → Portfolio, plus Studio → Portfolio         |
| `/portfolio/[slug]`    | the piece, plus Pages → Portfolio → Piece pages    |
| `/visiting-albania`    | Pages → Visiting Albania, plus FAQs                |
| `/journal`             | Pages → Journal, plus Content → Journal posts      |
| `/journal/[slug]`      | the post                                           |
| `/contact`             | Pages → Contact, plus Studio details and FAQs      |
| `/privacy`, `/cookies` | Settings → Legal pages (served by `[...slug]`)     |

Any other URL gets the site's 404 page (`src/app/(frontend)/not-found.tsx`).

## Design system

- Tokens live in `src/app/(frontend)/globals.css` (`@theme`). The accent is `--color-accent` (#FF5100) and changes everywhere from that one line. Text on the accent uses `--color-on-accent` (black, for WCAG contrast).
- Breakpoints follow the design: `md` from 681px, `lg` from 1001px, `2xl` from 1700px.
- **Layout and type utilities:**
  - Layout: `px-site` and `py-section`.
  - Headings: `text-display`, `text-hero`, `text-h2`, `text-h2-lg`, `text-h2-sm`, `text-cta`, `text-h3`.
  - Labels: `label`, `label-sm`, `label-xs`, `tag`.
  - Buttons and links: `btn btn-accent`, `btn btn-outline`, `link-plain`, `link-text`.
  - Surfaces: `grid-bg`, `framed`.
  - `photo`: black-and-white photos, unless switched off in Studio details.
- **Primitives in `src/components/ui/`:**
  - `StyledHeading`: the three-tone CMS headings.
  - `Action`: CMS buttons and links.
  - `Tag`, `Lines` / `Paragraphs` (plain CMS text with its line breaks).
  - `Blocks`: `SectionHead`, `PageHero`, `EndCta`, `NumberedCards`, `Notice`, `NeedleDivider`.
  - `ScrollTrack`: sideways galleries with prev/next buttons.
  - `Lightbox`, `CmsImage`, `SocialIcon`.
- **Line art** is original SVG in `src/components/art/`: stencils that draw themselves in, flash icons, and glyphs drawn as SVG because iOS turns `✳` and `▶` into emoji.
- **Motion** (`src/components/motion/`) is plain CSS transitions started by IntersectionObservers, with no animation library:
  - `PageMotion` reveals anything marked `data-reveal` and draws `data-stencil` art.
  - `HeroParallax` and `MobileCta` run on the homepage only.
  - Hidden states only apply once JS has loaded (`html.js-ready`) and when motion is allowed, so nothing is hidden without JS.
- Menus and FAQs use `<details>`, and the enquiry form's travel fields show with CSS, so they work without JS.

## CMS (Payload)

- Config: `src/payload.config.ts`. Collections are in `src/collections/`, globals in `src/globals/`, access rules in `src/access/` and shared fields in `src/fields/`. Routes are mapped in `src/lib/routes.ts`.
- **Roles:** `admin` can do everything. `editor` can manage all content and read enquiries, but can't change or delete them, manage users or change tracking IDs. The first account created at `/admin` becomes an admin.
- **Drafts and scheduling:** journal posts and all page globals have drafts and autosave, and posts can also be scheduled. Scheduled publishes run as Payload jobs. On a Node server, Payload checks for them every minute. On Vercel, `vercel.json` has a cron that calls `/api/payload-jobs/run` with `CRON_SECRET`. It runs once a day (06:00 UTC) because Vercel Hobby rejects anything more frequent. On Pro, change the schedule to `* * * * *`.
- **Live preview:** `/api/preview` needs `PREVIEW_SECRET` and a logged-in CMS session, then turns on Next.js draft mode. `/api/exit-preview` turns it off. While in draft mode, the layout mounts `src/components/LivePreviewListener.tsx`.
- **Revalidation:** every collection and global calls `src/hooks/revalidate.ts` after published changes. Data fetchers (`src/lib/data.ts`) must tag their caches with the tag of **every** collection they read (`src/lib/cache-tags.ts`). Code running outside a request (the job runner) revalidates through `POST /api/revalidate` with `REVALIDATE_SECRET`.
- **Media storage:** local disk in development (`/media`, plus `/media-private` for enquiry reference files), or Cloudflare R2 when the `S3_*` variables are set.
  - `S3_BUCKET` is public: set `S3_PUBLIC_URL` to its r2.dev or custom-domain URL.
  - `S3_PRIVATE_BUCKET` must **not** be public.
  - Uploads go straight from the browser to R2, so the public bucket needs a CORS rule that allows `PUT` from the site's origin.
  - The storage plugin's columns (`prefix`, `_objectKey`) exist whether or not R2 is on (`alwaysInsertFields`), so the schema doesn't change between environments.
  - `pnpm media:to-r2` copies files already uploaded to local disk into R2.
- **Email:** Resend, when `RESEND_API_KEY` is set. `EMAIL_FROM_ADDRESS` must be on a domain verified in Resend. Without a key, emails are printed to the console.
- **AI assistants (MCP):** `@payloadcms/plugin-mcp` serves `POST /api/mcp`, configured in `src/plugins/mcp.ts`.
  - It can find, create and update content collections, and find and update the page globals, studio details and menus. Media can be found and relabelled, not uploaded. Nothing can be deleted, and leads and users aren't exposed.
  - Keys live in Settings → AI access keys. A key acts as the user who created it, so the usual access rules apply, and each key only gets the capabilities ticked on it.
  - Clients send `Authorization: Bearer <key>`. ChatGPT can't send headers (it offers only OAuth or no authentication), so it connects to `/api/mcp?key=<key>` with "No authentication". Anyone with that URL has the key's access, and the URL shows in request logs: give such keys only what they need.
  - Changes save as drafts only when the assistant passes `draft: true`, which the server's instructions ask it to do; otherwise they go live at once.
  - Keys are an auth collection too, so `req.user` can be a key rather than a CMS user. Access rules check `hasRole()` or `isCmsUser()` (`src/access/`), never just that a user exists or its id.
- **Schema changes:** development uses Payload's automatic schema push. When a change renames or removes fields, the push asks for confirmation in the terminal. Before launch, production switches to migrations (`payload migrate:create` / `payload migrate`).

## For editors: where things live in the CMS

Log in at `/admin`. The menu on the left has five groups:

- **Content:** journal posts, journal categories, and images and videos.
- **Studio:** artists, portfolio categories, portfolio pieces and FAQs. To change the order they appear on the site, drag rows in the list. Each FAQ chooses the pages it appears on (Homepage, Contact, Visiting Albania). A portfolio piece has photos (the first is its card image) and can have a short video; give the video a **Video cover**, a still from the clip, which is shown before it plays and on the homepage.
- **Leads:** tattoo enquiries from the website form (once it's connected), and the photos and videos clients attach.
- **Settings:** legal pages (privacy and cookies), CMS users, AI access keys, studio details and menus. Studio details covers the name, address, opening hours, social links, the black-and-white photo switch, the closing call to action shared by several pages, and the "page not found" text.
- **Pages:** the text of every page, section by section: Homepage, About, Portfolio, Visiting Albania, Journal and Contact.

Headings have three boxes, **White**, **Grey** and **Orange**, shown in that order, each on a new line. Section numbers like "01 /" are added automatically.

The homepage galleries show the pieces chosen in **Pages → Homepage → Portfolio**: **Photos** and **Films**, each in the order you drag them into. The pages About, Portfolio, Visiting Albania and Journal can each have a **Background photo** at the top (Hero tab); it's shown darkened behind the heading.

Pages and journal posts save a draft automatically while you type. Nothing changes on the website until you press **Publish**. To publish a post on a later date, use the arrow next to Publish. The eye icon at the top opens a live preview next to the form, and you can switch between Mobile and Desktop above the preview.

Portfolio pieces and journal posts each have their own page. The address comes from the slug, which is made from the title. **Lock the slug** (the lock icon) once a piece is published, so renaming it later doesn't change its address.

Every page, post and portfolio piece has an **SEO** tab. Click "Auto-generate" to fill in the Google title and description, then adjust them. The preview shows roughly how the page will look in Google.

To let ChatGPT read and edit the site's content:

1. In **Settings → AI access keys**, create a key. Give it a label, tick **Enable API Key** and copy the key.
2. In the sidebar, tick what it may do, e.g. **Find** and **Update** for Homepage. Then save.
3. In ChatGPT, add a custom MCP server with the address `https://<the site>/api/mcp?key=<the key>` and **No authentication**.

Treat that address like a password. Ask ChatGPT to save changes as drafts, then check them with the preview and publish them yourself. To cut off access, delete the key.

Everything there now is starting text and placeholder images. Replace it with the real details before launch, especially what Google shows: the address, phone number, opening hours and the portfolio.
