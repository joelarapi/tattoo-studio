# Build prompt: Tattoo studio homepage (Next.js + Payload CMS)

> Paste everything below this line into Claude Code, run from an empty project folder.

---

You are building the production homepage (plus the blog it depends on) for a **tattoo studio website**. The site's job is to **generate leads from Google Ads and Meta Ads traffic** and to **rank organically** (local SEO + blog). Visual quality matters, but SEO, Core Web Vitals and lead capture matter more. When the two conflict, choose performance and SEO, then tell me what you traded off.

Work in the phases listed at the end. After each phase, run `pnpm build` and `pnpm lint`, fix all errors, and give me a short summary before you continue.

## 1. Tech stack (fixed decisions)

- **Framework:** Next.js (App Router, TypeScript, React Server Components). Use the newest Next.js major that the **current Payload 3 release officially supports**; check Payload's `peerDependencies` and don't force an unsupported version.
- **CMS:** **Payload CMS 3**, installed **inside the same Next.js app** (scaffold with `npx create-payload-app@latest`, blank template). The admin panel goes at `/admin`. Fetch data with Payload's **Local API** in server components, not REST.
- **Database:** PostgreSQL (`@payloadcms/db-postgres`). Read the connection from `DATABASE_URI`.
- **Media storage:** S3-compatible storage via `@payloadcms/storage-s3`, targeting Cloudflare R2 (env vars). Fall back to local disk in development.
- **Rich text:** Lexical (`@payloadcms/richtext-lexical`).
- **Styling:** Tailwind CSS v4, with all design tokens defined as CSS custom properties (section 3). No component libraries such as shadcn or MUI. Every component is custom.
- **Animation:** `gsap` (npm) with ScrollTrigger, SplitText, ScrambleTextPlugin and DrawSVGPlugin (all free in the npm package now), plus `lenis` for smooth scrolling. Use the `@gsap/react` `useGSAP` hook for cleanup.
- **Fonts:** `next/font/google`: **Roboto** (400/500/700) for headings and body, **Roboto Mono** (400/500) for labels, nav and buttons. Both are self-hosted and use `display: swap`.
- **Package manager:** pnpm. Use ESLint and Prettier.
- **Hosting target:** Vercel or a Node VPS (keep both possible: no Vercel-only APIs).

## 2. Design reference: what to emulate (do NOT copy)

The visual direction is inspired by the homepage of myrefactory.com, a Webflow site built in a dark, technical, "engineering drawing" style. **Recreate the aesthetic and interaction patterns only.** Do not copy its text, logos, SVG artwork, images, videos or code. All copy and art must be original and about tattooing.

Here is what that site does, so you can reproduce the feel:

- **Pure black page** (`#000`), white headings, mid-grey body copy (`#A8A8A8`), and one hot accent colour (orange `#FF4800`) used sparingly: primary buttons, small corner ticks, active progress dots, tiny square bullets before eyebrow labels.
- **Two-font system:** large, light-weight (400) Roboto headings with tight tracking (−0.02em), and small UPPERCASE Roboto Mono labels (12–14px, weight 500) for nav links, eyebrows, buttons and index numbers ("001", "002").
- **Technical line-art backgrounds:** faint 1px grid lines (`#212121`/`#343434`), large thin circles and arcs like a drafting diagram, and dashed "beams" of light travelling along those SVG paths. Line art draws itself on scroll (DrawSVG).
- **Corner brackets:** cards and grids get small L-shaped accent ticks at their corners, and grid borders animate (draw) in when they enter the viewport.
- **Hero:** a small dark pill eyebrow ("■ tagline · GET STARTED →"), a big centred H1 whose characters **flicker in randomly** on load (SplitText chars, shuffled, quick opacity yoyo), a short intro paragraph, and a "SCROLL TO BEGIN" mono label with an animated scroll indicator.
- **Scroll-scrubbed hero sequence (the key feature):** below the hero, a full-viewport **canvas stays pinned (CSS `position: sticky`)** while the user scrolls through a tall section. As they scroll, the canvas shows successive frames of a 3D-rendered video shot **on pure black**, so the footage blends seamlessly into the page. Four numbered step panels ("Break it down", "Think again", "Make it matter", "Put it to work") scroll past on the left, each heading followed by a paragraph that reveals with a character scramble/flicker. A progress indicator (a pill-shaped track of small dots that light up in the accent colour as progress advances) shows how far through the sequence you are.
  - *How they built it:* a hidden, muted `<video>` whose `currentTime` is set from ScrollTrigger progress, with each decoded frame drawn to the canvas (`requestVideoFrameCallback`, cover-fit maths, devicePixelRatio capped at 1.5), separate encodes for Chrome, Firefox and mobile, and a static first-frame WebP shown until the video is ready. **We will use the image-sequence technique instead (section 5)**, because it's more reliable on iOS Safari and Firefox.
- **Featured projects:** a centred, draggable, autoplaying card slider. The active card is large in the centre with neighbours peeking in on each side. Each card has a title top-left, a mono index number top-right ("001"), and a muted looping video or image.
- **Services grid:** a heading on the left and a small secondary button on the right, above a 2×2 grid with hairline borders and accent corner ticks. Each cell has an icon, a title, a short paragraph and a small accent "LEARN MORE →" button.
- **Stats bento grid:** dark cards (`#111`, radius 8px, padding about 28px) with a 3D render or illustration on top and a stat sentence below, where the number is bold white and the rest is grey.
- **Mission / statement section:** a centred eyebrow, a large two-line heading and two buttons (secondary dark and primary accent), over big circular line art with travelling dashed beams.
- **Audience cards:** an eyebrow plus a large heading where the second sentence is grey, above four dark cards in a row, each with an icon, a title and a paragraph.
- **Footer:** a dark rounded panel with the logo and a brand paragraph (with a notched/angled clip-path corner), plus mono-labelled columns for Navigation, Featured projects, Newsletter (email input with an accent submit button and a consent checkbox) and Contact.
- **Motion language:** one custom ease everywhere, `CustomEase.create("studio", "0.625, 0.05, 0, 1")`, default duration 0.6s. Button labels **scramble** on hover (ScrambleText). Fades are small and quick. Lenis smooth scroll is synced with ScrollTrigger.
- **Buttons:** height 3rem (small variant about 2rem), radius 0.25rem, Roboto Mono uppercase 12–14px with a trailing "→". Primary is accent-filled with white text (hover: accent mixed 20% toward black). Secondary is `#212121` (hover: `#4E4E4E`).

## 3. Design tokens

Define these in `app/(frontend)/globals.css` as CSS variables and expose them to Tailwind v4 via `@theme`:

```css
--color-bg: #000000;
--color-surface: #111111;     /* cards */
--color-surface-2: #212121;   /* secondary buttons, borders */
--color-line: #343434;        /* line-art strokes, grid */
--color-muted: #4E4E4E;
--color-text-muted: #A8A8A8;  /* body copy */
--color-text-faint: #717171;  /* captions */
--color-text: #FFFFFF;
--color-accent: #FF4800;      /* SINGLE accent; keep it swappable in one place */
--color-accent-hover: color-mix(in srgb, var(--color-accent), black 20%);

--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--ease-studio: cubic-bezier(0.625, 0.05, 0, 1);

/* Fluid type: clamp between a 320px and 1920px viewport */
--text-display: clamp(3rem, 1.6rem + 4.6vw, 7.64rem);
--text-h1: clamp(2.25rem, 1.45rem + 3.2vw, 5.46rem);
--text-h2: clamp(2rem, 1.3rem + 2.9vw, 4.86rem);
--text-h3: clamp(1.75rem, 1.15rem + 2.5vw, 4.25rem);
--text-h5: clamp(1.25rem, 1.05rem + 1.1vw, 2.32rem);
--text-large: clamp(1.125rem, 1.09rem + 0.18vw, 1.3rem);
--text-main: clamp(0.9375rem, 0.92rem + 0.09vw, 1.03rem);
--text-label: 0.875rem;
--text-label-sm: 0.75rem;

/* Layout */
--site-margin: clamp(1.5rem, 0.5rem + 5vw, 9.36rem);   /* side gutter */
--site-max: 120rem;
--gutter: 0.5rem;
--section-space: clamp(4rem, 3.2rem + 3vw, 7rem);
--section-space-lg: clamp(5.5rem, 4.6rem + 4.5vw, 10rem);
--nav-height: 4rem;
```

Type rules: headings use weight 400, line-height 1.2, letter-spacing −0.02em, `text-wrap: balance`. Body uses line-height 1.4 and `text-wrap: pretty`. Labels use Roboto Mono, uppercase, weight 500. Selection background is the accent at 60%.

## 4. Homepage sections (adapted to a tattoo studio)

Build `app/(frontend)/page.tsx` from section components in `components/home/*`. All copy, images and items come from Payload (section 6), seeded with realistic placeholder content. Use semantic HTML: one `<h1>`, an `<h2>` per section, `<section aria-labelledby>`.

1. **Nav** (fixed and transparent, reveals on load): logo (placeholder SVG wordmark) on the left. On the right, mono links: STYLES (dropdown listing styles from the CMS), ARTISTS, WORK, JOURNAL (the blog), STUDIO, and a primary button "BOOK A CONSULT →". On mobile, a full-screen menu behind a hamburger. **No line art, grid lines or decorative SVG on the navigation**: keep it clean (the hero's line art must sit behind the nav without extending into it).
2. **Hero:** an eyebrow pill (e.g. "■ Custom tattoos in Tirana · BOOK NOW →"), the H1 (e.g. "Your story, permanently drawn"), a 1–2 sentence intro, the primary CTA, and the "SCROLL TO BEGIN" indicator. The background is drafting-style SVG line art: tattoo-machine silhouettes, compass circles, stencil linework, all thin `--color-line` strokes, drawn in with DrawSVG.
3. **The process (scroll-scrubbed sequence):** the `<ScrollSequence>` component (section 5) with four steps from the CMS: *01 Consultation → 02 Custom design → 03 Stencil & ink → 04 Heal & keep*. Each step has a heading, a paragraph and an optional small mono label. Step panels sit on the left on desktop. On mobile they overlay the bottom of the canvas with a gradient scrim behind them for legibility.
4. **Featured work slider:** a centred, draggable, autoplaying slider (GSAP Draggable + Inertia, or Embla if simpler and lighter; your choice, justify it) of `PortfolioItems` marked as featured. Cards show the piece title, artist name, style tag, a mono index "001", and an image or a short muted loop (`preload="none"`, playing only while visible via IntersectionObserver). Include keyboard arrows and prev/next buttons with `aria-label`s. Each card links to the artist page.
5. **Styles grid:** the heading "What we tattoo" with a secondary "SEE ALL WORK" button, above a 2×2 grid (1 column on mobile) with drawn hairline borders and accent corner ticks. Each cell shows a `Style` from the CMS (Fine line, Blackwork, Realism, Traditional…): icon, title, description, and a small "LEARN MORE →" button linking to `/styles/[slug]` (create a stub page).
6. **Studio in numbers (bento):** dark cards with an image on top and a stat sentence (bold number + grey text), e.g. years open, tattoos completed, Google rating, resident artists. **All numbers come from the CMS.** Never hard-code claims.
7. **Statement section:** the eyebrow "■ CRAFT, HYGIENE & ARTISTRY", a large two-line heading (e.g. "Where the needle meets the story"), a paragraph, and two buttons (secondary "OUR STUDIO", primary "BOOK A CONSULT"), over circular line art with travelling dashed beams.
8. **Meet the artists:** an eyebrow, a heading whose second sentence is grey, and 3–4 artist cards (portrait, name, specialities, Instagram handle, link to `/artists/[slug]` stub) from the CMS.
9. **Our standards** (the reference's "materials" pattern): four items with an icon, title and text, such as sterile single-use needles, vegan inks, licensed artists and aftercare support, laid out around a central line-art mark.
10. **Latest from the journal:** the three most recent published `Posts` (cover, category, date, title, excerpt), plus a "READ THE JOURNAL" button. This internal linking is important for SEO.
11. **FAQ:** an accessible accordion of 5–8 CMS-managed questions (pricing, pain, aftercare, age policy, deposits). Output `FAQPage` JSON-LD.
12. **Booking CTA + lead form:** the heading "Ready when you are", over a compact consultation form. Fields: name, phone/WhatsApp, email, style (select from CMS styles), placement, approximate size, preferred artist (optional), idea description, optional reference image upload (≤ 5 MB, images only), marketing-consent checkbox, and privacy note. See section 8 for handling.
13. **Footer:** a rounded dark panel with the logo, brand paragraph and a notched clip-path corner, plus columns for Navigation, Styles, Newsletter, and Contact (address with a Google Maps link, phone, email, opening hours from the CMS). Add social icons and a legal line.

Shared components to create: `Button` (primary/secondary/small, with scramble-on-hover and a working `asChild`/link variant), `Eyebrow`, `SectionHeading`, `CornerTicks`, `GridLines` background, `LineArt` (DrawSVG wrapper), `DashedBeam`, `SplitReveal` (heading char flicker / paragraph scramble on enter), `Container`.

## 5. `<ScrollSequence>`: scroll-scrubbed frame animation (most important component)

Implement it as a client component, `components/scroll-sequence/ScrollSequence.tsx`, plus a frame-extraction script.

**Asset pipeline:**
- `scripts/extract-frames.sh <input.mp4> <name>` uses ffmpeg to output:
  - desktop: 1920px wide, **AVIF with a WebP fallback**, 24 fps, up to about 180 frames → `public/sequences/<name>/desktop/0001.avif`…
  - mobile: 960px wide, every 2nd frame (about 90 frames) → `public/sequences/<name>/mobile/…`
  - `manifest.json` with `{ frameCount, width, height, desktopPath, mobilePath, ext }`
  - `poster.avif` (frame 1) used as the LCP image.
- Document in the README that the source video should be shot or rendered **on a pure black background**, subject centred, 6–10 s, at least 1080p, with no baked-in text.
- Put a placeholder sequence in place, generated by a script that draws numbered frames with an expanding ring on black (node-canvas or ffmpeg `testsrc`), so the component works before real footage exists.

**Runtime behaviour:**
- Markup: an outer wrapper about `400vh` tall (configurable per step count) containing a `position: sticky; top: 0; height: 100svh` stage, with the `<canvas>` and the step panels as **real HTML text** (never baked into frames).
- Render the poster as a `next/image` with `priority` and `fetchPriority="high"` underneath the canvas, so LCP is a normal image. The canvas fades in over it once the first frames have decoded.
- **Progressive loading:** start loading only when the section is within about one viewport (IntersectionObserver). Load frame 1, then every 8th frame, then every 4th, then the rest. While a frame isn't loaded yet, draw the **nearest loaded frame**, so scrubbing works immediately. Decode with `createImageBitmap` where supported. Use a concurrency limit of about 6 requests.
- Pick the mobile or desktop frame set by `matchMedia('(max-width: 767px)')` and `navigator.connection?.saveData`. With Save-Data on, skip the sequence entirely and show the poster.
- Map progress to a frame with GSAP ScrollTrigger: `trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub: 0.5` (0.6 on mobile), driving `frame = Math.round(progress * (frameCount - 1))`. Draw only when the frame index changes, inside `requestAnimationFrame`.
- **Cover-fit drawing** (like CSS `object-fit: cover`). Canvas backing size = CSS size × `min(devicePixelRatio, 1.5)` (1 on mobile). Debounce resizing by 200 ms, then call `ScrollTrigger.refresh()`.
- Step panels: each step is active over its quarter of the progress range. Its heading and paragraph run the `SplitReveal` animation, and the active step index is exposed to the progress indicator.
- Progress indicator: an SVG pill-shaped track of small square dots. Dots near the current progress light up in `--color-accent`, with neighbours in fading greys.
- `prefers-reduced-motion: reduce` → no scrubbing and no reveals: show the poster and render the steps as a normal stacked list.
- With JavaScript disabled, the poster and all step text are visible and readable.
- Clean up everything on unmount: kill ScrollTriggers, close ImageBitmaps, remove listeners.
- Props: `name`, `steps`, `heightVh?`, `className?`. Write a short JSDoc explaining how to swap in a new video.

Do **not** implement the `<video>.currentTime` approach. If you think it's needed somewhere, explain why first.

## 6. Payload CMS: content model for the marketing team

The marketing team must be able to edit the blog and all homepage content without a developer.

**Collections:**
- `users`: auth with roles `admin` | `editor`. Editors can manage all content but cannot manage users, see the `leads` export settings, or change globals marked admin-only.
- `media`: upload collection with **required `alt`**, optional caption, image sizes (thumbnail 400, card 800, hero 1600, og 1200×630) in AVIF/WebP via sharp, focal point enabled.
- `posts`: title, slug (auto-generated from the title and editable), excerpt (max 160), cover (media), content (Lexical with headings, lists, links, images, quotes, and an embedded "CTA block" and "Artist card block"), author (relationship to `users` or an `authors` collection), categories (relationship), tags, `publishedAt`. **Turn on drafts, autosave, versions and scheduled publishing.**
- `categories`: title, slug, description.
- `artists`: name, slug, portrait, bio (rich text), specialities (relationship to styles), Instagram URL, years of experience, featured (checkbox), order.
- `styles`: name, slug, short description, long description, icon (media or icon select), hero image.
- `portfolio-items`: title, artist (relationship), style (relationship), images (array of media), optional short video (mp4/webm upload, ≤ 8 MB), placement, featured (checkbox), order.
- `faqs`: question, answer (rich text), order, show on homepage (checkbox).
- `leads`: all form fields plus `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, landing page, referrer, consent and timestamp. Read-only for editors (no update/delete), with list columns and filters suited to a sales follow-up.

**Globals:**
- `homepage`: hero (eyebrow, H1, intro, CTA label/link, poster override), process steps (array of 4: label, heading, text), section headings and intro copy for every homepage section, stats (array: number, unit, text, image), statement section copy, booking section copy. Every homepage string from section 4 comes from here.
- `site-settings`: studio name, logo, address (street, city, postcode, country, geo lat/lng), phone, WhatsApp, email, opening hours (array of day + open/close), social links, Google Maps URL, default SEO (title template, description, OG image), and tracking IDs (GTM ID, Meta Pixel ID; admin-only).
- `navigation`: header links and footer columns (editable).

**Plugins and editor experience:**
- `@payloadcms/plugin-seo` on `posts`, `styles`, `artists` and the `homepage` global, generating title and description from content, with a preview of the Google snippet.
- **Live preview** for posts and the homepage at desktop and mobile breakpoints, using draft mode (`/api/preview` route, secured by a secret).
- Admin UI: group collections into "Content" (posts, categories), "Studio" (artists, styles, portfolio, faqs), "Leads", and "Settings". Add helpful field `admin.description` text written for non-technical marketers (e.g. "Keep under 60 characters for Google").
- **On-demand revalidation:** `afterChange` and `afterDelete` hooks on every collection and global call `revalidateTag()` / `revalidatePath()` for affected routes (post page, blog index, homepage, sitemap). Published changes must appear live within seconds, with no redeploy.
- Seed script `pnpm seed`: one admin user (from env), sample artists, styles, 8 portfolio items, 3 posts, FAQs, filled globals and placeholder images, so the homepage renders fully on first run.

## 7. Blog (the "Journal")

- `/journal`: a paginated list (12 per page), category filter via `/journal/category/[slug]`, statically generated with tag revalidation.
- `/journal/[slug]`: article page with title, meta (author, date, reading time), cover, rich-text renderer styled for long-form reading (max width about 68ch, grey body text, white headings), table of contents for H2s, related posts (same category), and an end-of-article booking CTA block.
- `generateStaticParams` for published posts. Drafts are visible only in preview mode.
- Style it with the same design system (dark, mono labels, line art kept subtle).

## 8. Lead capture, ads and tracking

- The form submits through a **Next.js Server Action**. Validate with **zod** on both client and server, and protect it with **Cloudflare Turnstile** (keys from env; skipped in development) and a honeypot field. Save to `leads` via the Local API, upload the reference image to `media` (private folder), then send a notification email (Payload email adapter, Resend or SMTP via env).
- On the first page load, capture UTM parameters, `gclid` and `fbclid` from the URL into a first-party cookie (30 days), and attach them to every lead.
- Load **Google Tag Manager** through `@next/third-parties/google`, gated by a lightweight custom cookie-consent banner implementing **Google Consent Mode v2** (default denied; "accept all" / "reject" / "preferences"). No third-party scripts before consent, except Consent Mode defaults.
- After a successful lead, push a `generate_lead` event to `dataLayer` (with a lead ID for deduplication) and, server-side, send a **Meta Conversions API** `Lead` event with the same event ID and hashed email/phone. Do this only if the `META_CAPI_TOKEN` env var is set and consent was given. Put the code in `lib/tracking/*`.
- Create a reusable ads landing route `/lp/[slug]` (a `landing-pages` collection built from homepage section blocks: hero, process, featured work, form, FAQ), with **noindex** by default and a toggle. The marketing team will build campaign pages with it.
- Thank-you state: an inline success message plus a redirect option to `/thank-you` (noindex) for ad-platform conversion tracking.

## 9. SEO requirements (non-negotiable)

- Every public page is statically generated or uses ISR. No client-only rendering of content. All text, including step text in the scroll sequence, is in the HTML.
- Use `generateMetadata` everywhere, built from CMS SEO fields with fallbacks to `site-settings`: title template `%s | Studio Name`, description, canonical, Open Graph and Twitter cards, and an `og:image` (fallback: dynamic OG image via `next/og` using the brand fonts and colours).
- JSON-LD (a `<JsonLd>` component):
  - Homepage: `TattooParlor` (name, address, geo, phone, openingHoursSpecification, sameAs socials, image, priceRange) plus `WebSite` and `Organization`.
  - Posts: `BlogPosting` plus `BreadcrumbList`.
  - Artists: `Person`.
  - FAQ blocks: `FAQPage`.
- `app/sitemap.ts` (homepage, journal, posts, artists, styles; lastModified from `updatedAt`). `app/robots.ts` disallows `/admin`, `/api`, `/lp/*` (unless indexable) and `/thank-you`.
- Images go through `next/image`, with explicit sizes, AVIF/WebP and CMS-required alt text. Only the hero poster has `priority`.
- Set `lang` on `<html>`. Make the language configurable (start with `en`; structure routes so `sq`, Albanian, can be added later with Payload localization; don't build i18n now, just don't block it).
- **Performance budget (Lighthouse, mobile, production build):** Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95. LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Load GSAP and Lenis only in client components and only where they're used. Preload no frames before the sequence is near the viewport.
- **No full-screen preloader or intro animation that blocks content** (the reference site has one; we deliberately don't, because it hurts LCP and ad Quality Score). The H1 flicker must start from visible-to-crawlers HTML. Apply hidden styles only after JS has loaded (e.g. a `js-ready` class on `<html>`), so there's no flash of invisible content without JS.

## 10. Accessibility

- WCAG 2.2 AA contrast. Grey `#A8A8A8` on black passes, but `#717171` is only for non-essential captions, and the accent must not carry small text on black. Check every text colour pair.
- Visible focus rings (2px accent outline, 3px offset). Full keyboard navigation for the nav dropdown, slider, accordion and form.
- SplitText targets must keep an `aria-label` with the full text, so screen readers don't read individual characters.
- All motion respects `prefers-reduced-motion`. Smooth scroll (Lenis) is disabled for reduced motion.

## 11. Project structure

```
app/
  (frontend)/
    layout.tsx, page.tsx, globals.css
    journal/, journal/[slug], journal/category/[slug]
    artists/[slug], styles/[slug], lp/[slug], thank-you
    api/preview, api/exit-preview
  (payload)/admin, (payload)/api          # generated by Payload
  sitemap.ts, robots.ts
collections/  globals/  blocks/  hooks/revalidate.ts  access/
components/
  home/*  scroll-sequence/*  ui/*  motion/*  seo/JsonLd.tsx  forms/*
lib/  (payload client helpers, tracking, utm, formatting)
scripts/  extract-frames.sh, make-placeholder-sequence.ts, seed.ts
payload.config.ts
.env.example
README.md
```

`.env.example` must list: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `PREVIEW_SECRET`, `REVALIDATE_SECRET`, `S3_*` (R2), `RESEND_API_KEY` or `SMTP_*`, `LEADS_NOTIFY_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_GTM_ID`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

Write the README for two audiences: **developers** (setup, env, seed, frame pipeline, deploy) and **marketing editors** (how to write and schedule a post, fill SEO fields, preview, add portfolio work, find leads). Keep the editor section free of jargon.

## 12. Phases (do them in order, checking in after each)

1. **Scaffold:** Payload + Next app, Postgres, Tailwind v4, fonts, tokens, base layout, Lenis + GSAP provider, `Button`/`Eyebrow`/`Container` UI primitives. Build passes.
2. **CMS model:** all collections, globals, access control, SEO plugin, drafts/scheduling, live preview, revalidation hooks, seed script. Show me the admin structure.
3. **ScrollSequence:** frame scripts, placeholder sequence, component with progressive loading, reduced-motion and no-JS fallbacks. Test it on a standalone `/dev/sequence` route (remove before launch).
4. **Homepage sections 1–13**, wired to CMS data, with line art and motion (no line art on the navigation).
5. **Journal** (index, category, post), artist and style stub pages.
6. **Lead form, consent banner, GTM / Meta CAPI, UTM capture, `/lp/[slug]`, `/thank-you`.**
7. **SEO pass:** metadata, JSON-LD, sitemap, robots, OG images.
8. **QA:** Lighthouse mobile and desktop on a production build (`pnpm build && pnpm start`), keyboard and screen-reader spot checks, reduced-motion check, no-JS check, iOS Safari and Firefox notes for the sequence. Fix whatever misses the budget, then report the final scores.

## 13. Ground rules

- Ask before adding any dependency not listed here.
- No placeholder "lorem ipsum": write short, plausible tattoo-studio copy and mark it in the CMS as editable.
- No hard-coded business facts (address, prices, stats, ratings). Everything comes from `site-settings` or `homepage`.
- Don't copy any asset, text or code from the reference website.
- Keep components small and typed. Prefer server components, and add `'use client'` only where interaction or animation needs it.
