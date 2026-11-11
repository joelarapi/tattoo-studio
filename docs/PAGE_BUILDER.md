# Page builder: plan and working notes

**Done and live:** merged into `main` (PR #3) on 9 Nov 2026. This file stays as the reference for how the page builder works and why it was built this way. What's still open is under step 10 in [Progress](#progress).

Branch: `page-builder`, made from `main` at `a39c426` on 9 Nov 2026.

---

## Goal

The studio owner, and ChatGPT through the MCP endpoint, can build and change pages without code:

- add, remove, reorder and duplicate sections ("blocks") on any page
- create new pages at their own address (e.g. `/aftercare`) and link them from the menus
- choose from a few design options per section: background, image side, card style and so on

**The current site must come out the same after the switch.** Every section that exists today becomes a block. The seed rebuilds today's pages from those blocks, and screenshots are compared before and after.

**Guardrails, not free styling.** Blocks offer a few named options. There are no colour pickers, font sizes or pixel spacing, so the site keeps the approved design whatever the owner does.

**Still needs code afterwards:**

- new _kinds_ of section
- the global look: fonts, the accent colour, the spacing scale, animations
- the structure of the header and footer (their links stay editable)
- nested layouts such as columns inside a section

---

## Progress

- [x] Plan written (this file). 9 Nov 2026.
- [x] **0. Prep**
  - [x] Branch `page-builder`
  - [x] D1: the user switched to **the production database** (9 Nov 2026). They emptied it in the Neon SQL editor and I seeded it with this branch. The live site was broken until the merge the same day, because the old code expected the old page globals.
  - [x] CLAUDE.md points to this file
- [x] **1. Foundations** (code)
  - [x] `src/blocks/`: `settings.ts` (section settings), `BlockSection.tsx`, `types.ts`, `registry.tsx`, `RenderBlocks.tsx`, `PageView.tsx`, `validate.ts`, `summary.ts`, `populated.ts`
  - [x] `pages` collection (`src/collections/Pages.ts`)
  - [x] Routes: `/` and `/[...slug]`; `getPage`, `getPageSlugs`, `getPieceTemplate`, `getArticleTemplate`; `pathForDoc('pages')`
  - [x] Studio details: "Enquiry form" tab (`enquiryForm`)
  - [x] Template globals `piece-template` and `article-template`
  - [x] `blocksAsJSON: true` in the Postgres adapter: proven (uploads, relationships and arrays in blocks survive create, depth-2 reads, drafts and publishing; int and e2e tests)
  - [x] `pnpm build` passes
  - [x] Cache keys carry `CACHE_VERSION` (`src/lib/data.ts`). Stale `unstable_cache` entries from older builds in `.next/cache` broke the first build, and probably explain why the live 404 page had lost its text.
- [x] **2. Homepage blocks** (code): `homeHero`, `textStrip`, `workShowcase`, `artist`, `steps`, `cards`, `enquiry`, `faq`, `latestPosts`, `pageCta` (named `pageCta`, because `cta` is the journal-post block), `divider`. Seed: `src/seed/pages.ts`. [x] Screenshots match: the homepage is pixel-identical at 1440, 1000 and 390 px.
- [x] **3. Inner-page blocks** (code): `pageHero`, `text`, `portfolioGrid`, `journalList`, card styles panel/feature/place, `steps` timeline. Seeded pages: home, about, portfolio, visiting-albania, journal, contact, privacy, cookies. [x] Screenshots match.
  - Portfolio, Journal, the article, Privacy: identical.
  - Visiting Albania: identical at 1440 and 1000 px.
  - Small differences (recorded in `docs/design/README.md`):
    - About's dark band gains a line underneath.
    - Section heads (label and heading over cards) share one spacing, so a few cards sections move by up to 10 px on phones and 5 px on desktop.
    - The 404 page now shows its heading and text (the live one was missing them).
- [x] **4. Templates:** `portfolio/[slug]` and `journal/[slug]` read their template and render `after` (`pieceSuggestions`, `pageCta` band or shared).
- [x] **5. Remove the old model** (code): page globals, `pageGlobal.ts`, `LegalPages.ts`, the FAQ `pages` field, `PAGE_GLOBALS`/`faqPageOptions`, the route folders, `Sections.tsx`, `EnquirySection.tsx`, `FaqSection.tsx`, `PageHero`. Rich-text links, the SEO plugin, MCP and revalidation paths updated. [x] Database reseeded (122 documents).
- [x] **6. General-purpose blocks:** `imageText`, `gallery`.
- [x] **7. Admin polish**
  - [x] block groups, descriptions, validation messages
  - [x] section headers show their heading (`src/components/admin/BlockLabel.tsx`, via `forAdmin()` in `src/blocks/index.ts`)
  - [x] thumbnails for all 18 blocks in `public/admin/blocks/`, made by `pnpm blocks:thumbnails` (photos and films left out, so no client tattoos in git)
- [x] **8. Tests and docs**
  - [x] `tests/int/pages.int.spec.ts`, `tests/e2e/pages.e2e.spec.ts`, two new tests in `tests/e2e/frontend.e2e.spec.ts`
  - [x] README ("Pages", "How the page builder works", "Building pages"), CLAUDE.md decisions, `docs/design/README.md`
- [x] **9. Full verification**
  - `tsc`, `lint` and `build` pass.
  - `test:int`: 20 of 20 pass. `test:e2e`: 28 of 28 pass, against `next start` on port 3001.
  - Screenshots compared with the live site.
  - MCP: `tools/list` showed only the ticked tools; `findPages` returned the homepage's sections; `updatePages` saved a draft.
  - Not checked by hand yet: dragging sections with live preview in the admin. The e2e tests cover reordering through the API and the section headers.
- [ ] **10. Release**
  - [x] production database reseeded (before the merge, see step 0); merged into `main` (PR #3, 9 Nov 2026)
  - [x] live site checked (11 Nov 2026): every seeded page answers except `/privacy` (below), and the homepage renders its sections
  - [ ] re-create the AI access keys (the old ones went with the old database); not confirmed yet
  - [ ] **`/privacy` is a 404 on the live site** (found 11 Nov 2026). The public API lists only 7 pages; Privacy is missing, so it was deleted or unpublished in the CMS after the seed (every page was edited on 10 Nov). The footer and the enquiry form's privacy note link to it. Restore or republish it in the admin.
  - [ ] by hand: drag sections with live preview in the admin

### Log

Newest last. One line per working session: what was done and what's next.

- 9 Nov 2026: plan written; branch created. Next: decide D1, then step 1.
- 9 Nov 2026: D1 = new Neon branch; the user prefers **no commits until they ask**. Built all the code for steps 1–8: 18 blocks, the `pages` collection, the two templates, routes, seed, tests and docs. `tsc` and `lint` pass. `.env` still points at production (hash `b4828e0a`), so nothing touching the database was run. Next: the user creates the Neon branch → empty it, `pnpm seed`, `pnpm build`, `pnpm test:int`, dev server on port 3001, `pnpm test:e2e` with `E2E_BASE_URL`, screenshot comparison with production, `pnpm blocks:thumbnails`, MCP check, then check in with the user.
- 9 Nov 2026 (later): the user chose the production database instead and emptied it. Seeded it, then fixed what the real run found:
  - `layoutSummary` tripped on the portfolio grid's `intro` group
  - stale cache entries (fixed with `CACHE_VERSION`)
  - two text sizes
  - the e2e specs sharing a test user
  - the divider had no `data-block`

  Thumbnails generated. All checks pass (see step 9). Nothing committed: the user asks for commits. Next: the user commits; then merge into `main` and recreate the AI key (step 10). Production already holds the new data.
- 9 Nov 2026: committed (`1c9e0a1`) and merged into `main` by the user (PR #3).
- 11 Nov 2026: docs brought up to date with the merge; `AGENTS.md` added for Codex. Live check found `/privacy` missing (step 10).

---

## Decisions

| #   | Decision                    | Choice                                                                                                                                                                              | Status                           |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| D1  | Database during the build   | The production database (the user's choice; a separate Neon branch was planned first). Emptied and reseeded with this branch on 9 Nov 2026; the live site is down until the merge.  | Decided by the user, 9 Nov 2026  |
| D2  | Where pages live            | A `pages` collection (new pages possible), replacing the six page globals                                                                                                           | Decided                          |
| D3  | Legal pages                 | Become ordinary pages made of a `text` block (document layout). The `legal-pages` collection goes.                                                                                  | Decided                          |
| D4  | Styling freedom             | Named options per block only (see [Common section settings](#common-section-settings))                                                                                              | Decided                          |
| D5  | Piece and article pages     | Stay fixed templates. Their shared text moves to two template globals, which also get an "after the content" block area.                                                            | Decided                          |
| D6  | FAQs                        | The FAQ block picks its questions (drag to order; empty = all). The FAQ `pages` field goes.                                                                                         | Decided                          |
| D7  | Section numbers ("01 /")    | A page-level checkbox, "Number the sections", on for Home and Visiting Albania as today. Numbers follow block order and skip empty blocks.                                          | Decided                          |
| D8  | Shared closing CTA          | The `pageCta` block has "The shared one" (Studio details → Shared sections) or its own text. Article pages use the shared one by default.                                           | Decided                          |
| D9  | Nesting and columns         | Not in v1                                                                                                                                                                           | Decided                          |
| D10 | Ads landing pages (Phase 6) | The spec's `landing-pages` collection becomes pages with a "Landing page" option (served at `/lp/<slug>`, noindex by default, minimal header). To be confirmed when Phase 6 starts. | Proposed                         |
| D11 | Moving content at release   | Reseed (the content is still starting text). If the owner has entered real content by then, write a one-off migration script instead, before the switch.                            | Decided; re-check before release |

---

## What we're replacing

| Today (admin → Pages)                  | Becomes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Homepage** (global `homepage`)       | **Page `home` (served at `/`).** Blocks in order: `homeHero` (hero), `textStrip` (strip), `workShowcase` (work and films), `artist` (meetArtist, intro style), `steps` (visit, compact), `divider`, `cards` (plan: numbered, icons sketch/machine/ink, price note as the card note), `enquiry` (side: text), `faq`, `divider`, `latestPosts` (journal), `pageCta` (finalCta, own text). `mobileCta` becomes a page field. "Number the sections" is on.                                                                                                                           |
| **About** (`about-page`)               | **Page `about`:** `pageHero` (jump link "Get to know Tisi ↓" → `#artist`), `artist` (bio style, anchor `artist`), `cards` (focus: panel style, 2 columns, band background), `cards` (values: numbered, graphics circles/bars/asterisk), `text` (studio: split layout, lines background), `pageCta` (shared).                                                                                                                                                                                                                                                                     |
| **Portfolio** (`portfolio-page`)       | **Page `portfolio`:** `pageHero` (compact), `portfolioGrid` (intro and filter labels), `pageCta` (shared). `detail` moves to the **Portfolio piece pages** template global (see [Templates](#templates)).                                                                                                                                                                                                                                                                                                                                                                        |
| **Visiting Albania** (`visiting-page`) | **Page `visiting-albania`:** <ul><li>`pageHero` with the trip-outline side panel, a background photo and the jump-links bar</li><li>`cards` (plan: numbered with links, jump label)</li><li>`cards` (stay: feature style with symbol, tag, checklist and button; boxed notice; closing note = arrival)</li><li>`cards` (explore: place style with motif; small print; closing note = slow travel)</li><li>`steps` (itinerary: timeline, grid background)</li><li>`faq` (questions: split, jump label)</li><li>`pageCta` (endCta, own text)</li></ul>"Number the sections" is on. |
| **Journal** (`journal-page`)           | **Page `journal`:** `pageHero` (compact), `journalList` (featured and list labels), `pageCta` (shared). `article` moves to the **Journal article pages** template global.                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Contact** (`contact-page`)           | **Page `contact`:** `enquiry` (first block, so its heading is the H1; side: studio details with labels and the boxed notice), `cards` (next steps: numbered), `faq`. The `form` copy moves to **Studio details → Enquiry form**.                                                                                                                                                                                                                                                                                                                                                 |
| **Legal pages** (collection)           | **Pages `privacy` and `cookies`:** one `text` block each, document layout.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Studio details → Shared sections       | Stays: `endCta` (used by `pageCta` "shared" and by article pages) and `notFound`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

Small unification: today the darker bands use slightly different shades and borders (`#0b0b0b`, `#0d0d0d`, `bg-band`; top border or top and bottom). They become one "band" background. That's a deliberate tiny difference; record it in `docs/design/README.md`.

---

## Target model

### `pages` collection (`src/collections/Pages.ts`)

- **Labels and admin:**
  - Labels: Page / Pages. Admin group: "Pages", `useAsTitle: 'title'`, columns: title, slug, `_status`, updatedAt.
  - Description: "Every page of the site, built from sections. Portfolio pieces and journal articles have their own templates."
- **Fields:**
  - `title` (required). Shown in the admin and used as the fallback SEO title.
  - `slug`: lowercase letters, numbers and dashes. Unique, and not one of `admin`, `api`, `next`, `lp`, `_next`. The page `home` is served at `/`.
  - `numberSections` (checkbox): "Number the sections (01 / …)".
  - `layout`: a blocks field, label "Sections". It uses `blockReferences` to the page blocks (with `blocks: []`), and has validation (see [Rendering](#rendering)).
  - `mobileCta` (optional link group): "Orange bar pinned to the bottom on phones".
  - `seoTab()`.
- **Versions:** drafts with autosave (375 ms, as the page globals have now), max 50 versions. Scheduled publishing can be added the way posts have it.
- **Access:**
  - read: `publishedOrLoggedIn`
  - create, update, delete: `isAdminOrEditor`
- **System pages:**
  - `home`, `portfolio` and `journal` can't be deleted, and their slug can't change. A `beforeDelete` hook throws; the slug field gets `readOnly` through a condition.
  - Detail routes sit under `portfolio` and `journal`, and `/` needs `home`.
- **Hooks:** `revalidateCollection({ collection: 'pages', paths: doc => [pathForDoc('pages', doc.slug)] })`.
- **Preview:** `livePreview` and `preview` go to `generatePreviewPath(pathForDoc('pages', slug))`.

### Templates

Two globals in the "Pages" admin group, without drafts. Their revalidation tags their own global.

- **`piece-template`, "Portfolio piece pages":**
  - the fields of today's `portfolio-page.detail`: label, photoLabel, videoCaption, storyHeading, storyNote, direction, ctaLabel
  - `after`: blocks (`blockReferences`: `pageCta`, `pieceSuggestions`, `text`, `cards`, `divider`). Seeded with the travel band (`pageCta`, band style, two links) and `pieceSuggestions`.
- **`article-template`, "Journal article pages":**
  - tocLabel, backLabel, backButtonLabel
  - `after`: blocks. Seeded with `pageCta` (shared).

### Studio details (`site-settings`)

- New tab **"Enquiry form"** holding today's `contact-page.form`:
  - submitLabel, helperText, privacyNote
  - pendingNotice, successHeading, successMessage
- Every `enquiry` block uses it.

### FAQs

- Remove `pages` and `faqPageOptions`. The `faq` block's `faqs` relationship (hasMany, orderable) chooses the questions; empty means all.
- `getFaqs(page)` becomes `getFaqs(ids?)`.

---

## Block catalogue

Each block lives in `src/blocks/<slug>/`, with `config.ts` (the Payload `Block`, with an `interfaceName`, e.g. `CardsBlock`) and `Component.tsx` (a server component). They're registered once in `config.blocks` and referenced with `blockReferences`.

Reuse the field helpers in `src/fields/`: `styledHeading`, `tagField`, `paragraphs`, `text`, `image`, `heroBackground`, `linkGroup`, `optionalLink`, `linkList` and `cardList`. Reuse the existing UI components in `src/components/`: `SectionHead`, `NumberedCards`, `EndCta`, `HeroPhoto`, `Notice`, `ScrollTrack`, `PortfolioCard`, `FilmCard`, `FaqList`, `JournalList`, `PortfolioGrid` and `EnquiryForm`.

Admin groups (`admin.group`), as the owner sees them in "Add section":

**Page top** (only as the first block; at most one)

1. **`homeHero`, "Big intro with photos"** (from `HomeHero`)
   - label, heading (H1), intro, supporting
   - primaryCta, secondaryLink
   - factValue, factLabel, secondFact
   - primaryImage + primaryCaption, secondaryImage + secondaryCaption, imagesLink, artNote
   - Runs `HeroParallax`. Images: one eager, high priority.
2. **`pageHero`, "Page top"** (from `PageHero` and the Visiting hero)
   - tag (boxed), heading (H1), intro
   - buttons (0–2), note, indexLabel, background photo
   - `jumpLink` {label, anchor}: About's "Get to know Tisi ↓"
   - `size`: compact | tall
   - `sidePanel`: none | trip outline {title, stops[] {label, title, text}, footnote}
   - `showJumpBar` (checkbox): the bar under the hero, listing every block on the page that has a jump-link label

**Text**

3. **`textStrip`, "Phrase band":** phrases[] (max 6), separated by asterisks.
4. **`text`, "Text"**
   - tag, heading, body (rich text, `basicEditor`), link, note
   - `layout`: split (heading left, text right: About's studio) | stacked | document (narrow column for long text such as the privacy policy)

**Cards and lists**

5. **`cards`, "Cards"**
   - **Section fields:** tag, heading, intro
   - **Each card:** label, title, text, link, plus fields that depend on `style`:
     - feature: symbol (house/arrow), tag, checklist (one item per line), button
     - place: motif (columns/windows/waves), tag
     - numbered: graphic (none | sketch | machine | ink | circles | bars | asterisk)
   - **Section extras:** `note` {title, text, link} (the homepage price note), `notice` (boxed), `smallPrint`, `closingNote` {tag, title, text (rich)} (Visiting's arrival and slow-travel notes)
   - **`style`:**
     - numbered (`NumberedCards`: "01 / label")
     - panel (About's focus cards)
     - feature (Visiting's stay cards)
     - place (Visiting's explore cards)
   - `columns`: 2 | 3
   - Show fields with `admin.condition`, so each style only shows what it uses.
6. **`steps`, "Steps"**
   - tag, heading, text, button, steps[] {label, title, text}, link
   - `style`: compact (the homepage's "Visiting Albania" teaser) | timeline (the Visiting itinerary)

**Work and studio**

7. **`workShowcase`, "Portfolio gallery (sideways)"** (from `WorkSection`)
   - tag, heading, intro, button, creditLine, trackLabel
   - `pieces` (pick; empty = the first 9), `colourCycle` (checkbox, on)
   - films {trackLabel, itemLabel, watchLabel, pieces (only pieces with a video)}
8. **`portfolioGrid`, "Portfolio grid with filter"**
   - intro {tag, heading, text (rich)}
   - `showFilter`, allLabel, countLabel
   - `style` (optional: show one category only)
9. **`artist`, "Artist"**
   - artist (relationship), tag, heading, image (overrides the portrait), imageNote
   - `textSource`: own text | the artist's bio; text, button, note/signoff
   - `style`: intro (homepage) | bio (About); `imageSide`: left | right
10. **`faq`, "Questions (FAQ)":** tag, heading, `faqs` (pick and order; empty = all), `layout`: split | stacked.
11. **`latestPosts`, "Latest journal posts":** tag, heading, link, `count` (3).
12. **`journalList`, "Journal: featured and all articles"**
    - featured {tag, post (empty = the latest), label, buttonLabel}
    - list {heading, searchLabel, searchPlaceholder, emptyText, readLabel}
13. **`pieceSuggestions`, "More portfolio pieces"**
    - tag, heading, button, cardLink, `pieces` (pick)
    - On a piece page, if no pieces are picked, it suggests pieces 1, 3 and 6 further along the portfolio, as today.

**Contact and calls to action**

14. **`enquiry`, "Enquiry form"**
    - tag, heading, intro
    - `side`: text (homepage: studio name and city, detailText, contactLink) | studio details (contact page: studioLabel, directLabel, address, phone, hours from Studio details, notice)
    - The anchor is always `tattoo-enquiry` (`ENQUIRY_ID`), so at most one per page; validated.
    - `?project=` and `?travel=1` keep working.
15. **`pageCta`, "Call to action"**
    - `source`: shared | own text {tag, heading, text, button, note, links (max 2)}
    - `style`: centred (`EndCta`) | band (the travel band on piece pages)
16. **`divider`, "Divider":** the needle line (`NeedleDivider`). No fields.

**General purpose** (step 6)

17. **`imageText`, "Image and text":** image, imageNote, tag, heading, body (rich), button, `imageSide`.
18. **`gallery`, "Photo grid":** images[] (media), `columns`: 2 | 3, captions on/off. Photos get the usual black-and-white treatment.

Later, not in v1: video, quote, before/after, Instagram feed, pricing table, and saved sections (one section reused on several pages).

---

## Common section settings

Every block except the heroes, `textStrip` and `divider` ends with a collapsible group, "Section settings":

- **`anchor`:** the section's `id`, for `#links`. Lowercase and dashes. Optional; the enquiry block's is fixed.
- **`jumpLabel`:** the label in the page-top jump bar, e.g. "Plan your visit". Leave empty to leave the section out.
- **`background`:**
  - plain
  - band: dark band with lines above and below
  - lines: lines only
  - grid: the grid background

Section padding stays inside each block (`py-section` and so on). It isn't an option.

---

## Rendering

- **`src/blocks/registry.ts`:** maps `blockType` → `{ Component, load?, hero?: boolean, numbered?: boolean }`.
  - `load(block)` fetches what the block lists (pieces, posts, FAQs) with the existing cached fetchers in `src/lib/data.ts`. It returns `null` when there's nothing to show, so the block drops out, as the homepage's empty sections do today.
- **`src/blocks/RenderBlocks.tsx`** (server):
  1. Resolves every block's `load()` in parallel.
  2. Drops the empty ones.
  3. Gives section numbers in order, if the page has `numberSections`, to blocks marked `numbered`.
  4. Works out the H1: hero blocks render it; if the page has no hero, the first block's heading becomes the H1 (Contact). Every other block uses `h2`.
  5. Renders each block, passing `{ number, headingLevel, isFirst, jumpLinks }`.
- **`src/blocks/BlockSection.tsx`:** the `<section>` wrapper. It applies `id` (anchor), `scroll-mt-5`, the background classes and `data-block="<slug>"` (used by the thumbnail script and tests).
- **Validation on `layout`:**
  - Hero blocks only as the first block.
  - At most one hero.
  - At most one `enquiry` block.
  - Anchors unique within the page.
- **Motion rules stay:**
  - no `data-reveal` on hero or LCP content
  - `data-reveal-group` on card grids
  - `HeroParallax` only with `homeHero`
  - `MobileCta` only when the page sets `mobileCta`
- **Images:** at most one eager, high-priority image per page, in the hero block (`loading="eager"` + `fetchPriority="high"`; never `priority`).

---

## Routes and data

- `src/app/(frontend)/page.tsx` renders the page `home`.
- `src/app/(frontend)/[...slug]/page.tsx` renders any other page with a single-segment slug. It checks a cached slug list first (`getPageSlugs`), so junk URLs never hit the database and `notFound()` still renders the site's 404.
  - `/portfolio/[slug]` and `/journal/[slug]` keep their own routes. Next prefers them over the catch-all, which also serves `/portfolio` and `/journal`.
- **Delete:** `about/`, `contact/`, `visiting-albania/`, `portfolio/page.tsx` and `journal/page.tsx`.
- **`src/lib/routes.ts`:**
  - Remove `PAGE_GLOBALS`, `pageGlobalSlugs` and `faqPageOptions`.
  - `pathForDoc('pages', slug)` returns `/` for `home`, otherwise `/${slug}`. Artists point to `/about`.
- **`src/lib/data.ts`:**
  - `getPage(slug)`, depth 2, tagged with pages, media, artists, portfolio-items, styles, posts and faqs: everything blocks can populate.
  - `getPageSlugs()`.
  - `getPieceTemplate()` and `getArticleTemplate()`.
  - Remove the six `pageGlobal` fetchers.
- **Rich text:** `LinkFeature({ enabledCollections: ['pages', 'posts', 'portfolio-items'] })`. Readers of rich text are tagged with those collections (`linkable`).
- **Metadata:** `pageMetadata()`.
  - Title falls back to the first block's heading, then the page title.
  - Description falls back to the hero intro.
  - Image falls back to the hero image or background.

## Caching and revalidation

- Tags stay `collection:<slug>` / `global:<slug>`.
- Pages revalidate `collection:pages` and their path.
- Changing a portfolio piece, post or FAQ already revalidates its collection tag. `getPage` carries those tags, so pages that list them refresh.

## SEO

- `pages` get `seoTab()`.
- `src/plugins/seo.ts` gets `collections: ['pages', …]` and drops `globals: pageGlobalSlugs`. The generate functions read the title, description and image as in [Routes and data](#routes-and-data).
- `meta.title` still holds the full title.

## Admin experience

- **"Add section" drawer:** groups as in the catalogue.
  - **Thumbnails:** `imageURL: '/admin/blocks/<slug>.png'`, made by `scripts/block-thumbnails.ts`. It uses Playwright on a running dev server to screenshot `[data-block="<slug>"]` at 1440 px, then sharp resizes them to 480 px wide.
- **Every block and field has a short description in plain words.** Labels are in normal case; the site shows them in capitals.
- **Row labels:** a custom block `Label` component shows the block type plus its heading text, e.g. "Cards: From idea to appointment". Fall back to `blockName`.
- **Validation messages** say what to do, e.g. "Move the page top to the start, or remove it."
- **Live preview** works as on the globals today: autosave, then refresh.

## MCP (`src/plugins/mcp.ts`)

- **Exposed:**
  - `pages`: find, create, update
  - `piece-template` and `article-template`: find, update
  - Remove the six page globals.
- **Server instructions** gain:
  - a page's `layout` is an array of blocks with `blockType`
  - a page top comes first
  - keep `clientConsent` true
  - save as drafts
- **AI access keys need re-ticking afterwards.** The reseed at release deletes them anyway.

## Seed

- `src/seed/globals.ts` splits into:
  - `src/seed/pages.ts`: one function per page, building today's content as blocks
  - `src/seed/templates.ts`
  - Studio details in `globals.ts`, with the enquiry form copy
- Pages are created in menu order.
- FAQs lose `pages`. The FAQ blocks list the same questions each page shows today.
- `pnpm seed` must still run on an empty database without prompts.

## Database and release

- **During the build:** see D1. Whichever database is used, `.env` must point at it while on `page-builder`. Never run this branch against the production database while `main` still uses the old schema, unless D1's fallback was chosen.
- **Release:**
  1. Merge into `main`.
  2. Empty the production schema and run `pnpm seed`.
  3. Vercel redeploys.
  4. Re-create the client's CMS user and the AI access keys.
  5. Check every page live.
- **Before launch** (not part of this work): switch production to Payload migrations.

---

## Testing and verification

- **Screenshots:**
  - Before: today's site.
  - After: the builder branch.
  - Widths: 1440, 1000 and 390 px.
  - Pages: Home, About, Portfolio, a piece, Visiting Albania, Journal, an article, Contact, Privacy, and the 404 page.
  - Expect matches, except the band unification.
- **Integration tests** (`tests/int/`):
  - A page created through the Local API renders its blocks.
  - An unknown slug gives 404.
  - Reserved slugs are rejected.
  - A hero that isn't the first block is rejected.
  - A second enquiry block is rejected.
  - `home` can't be deleted.
  - The public sees only published pages; editors can create pages.
- **E2E tests** (`tests/e2e/`): update routes and selectors. Add:
  - reordering blocks changes the page (via the admin or the Local API)
  - the jump bar links to anchors
  - the enquiry block anchor works
  - live preview still loads
- **Manual checks:**
  - the admin block drawer with thumbnails
  - live preview while dragging blocks
  - keyboard and no-JS behaviour as before
  - MCP `tools/list` with a key
- `pnpm build`, `pnpm lint` and `pnpm test:int` after every step. Run `pnpm test:e2e` at steps 2, 3, 8 and 9.

---

## Files

- **New:**
  - `src/collections/Pages.ts`
  - `src/globals/PieceTemplate.ts`, `src/globals/ArticleTemplate.ts`
  - `src/blocks/` (`registry.ts`, `RenderBlocks.tsx`, `BlockSection.tsx`, `settings.ts`, `index.ts`, and one folder per block)
  - `src/seed/pages.ts`, `src/seed/templates.ts`
  - `scripts/block-thumbnails.ts`, `public/admin/blocks/*.png`
- **Changed:**
  - `src/payload.config.ts` (collections, globals, `blocks`)
  - `src/lib/routes.ts`, `src/lib/data.ts`, `src/lib/metadata.ts`
  - `src/fields/richText.ts`
  - `src/plugins/seo.ts`, `src/plugins/mcp.ts`
  - `src/collections/Faqs.ts`, `src/globals/SiteSettings.ts`
  - `src/app/(frontend)/page.tsx`, `[...slug]/page.tsx`, `portfolio/[slug]/page.tsx`, `journal/[slug]/page.tsx`
  - `src/seed/index.ts`, `src/seed/globals.ts`
  - the tests, README, CLAUDE.md, `docs/design/README.md`
- **Removed:**
  - `src/globals/{Homepage,AboutPage,PortfolioPage,VisitingPage,JournalPage,ContactPage,pageGlobal}.ts`
  - `src/collections/LegalPages.ts`
  - `src/app/(frontend)/{about,contact,visiting-albania}/`, `portfolio/page.tsx`, `journal/page.tsx`
  - `src/components/home/Sections.tsx` (its parts move into blocks)

## Rules to keep (from CLAUDE.md)

- **No hard-coded business facts:** the name, city, artist and numbers live in the CMS and the seed only.
- **No new dependencies** without asking. None are expected: blocks are built into Payload, and Playwright and sharp are already installed.
- **`.env` `DATABASE_URI` must match the checked-out branch.** Compare host hashes; never print the string.
- **Never delete media documents** while two databases share the R2 bucket.
- **Next 16 APIs:**
  - `revalidateTag(tag, { expire: 0 })`
  - no `priority` on images
  - `useSyncExternalStore` for query strings in client components on prerendered pages
- **Accessibility:**
  - one H1 per page
  - black text on orange buttons
  - reduced motion respected
  - glyphs as SVGs (`✳`, `▶`)
- **Check in after each step:** `pnpm build` and `pnpm lint`, and commit only when the user asks.
