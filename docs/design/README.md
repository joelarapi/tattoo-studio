# Design reference

The approved design for the site, saved from the design review at
https://londonink-tattoo-design-review.cubii.chatgpt.site (revision "real work", November 2026: the studio's own portfolio replaced the demo photos). It is static HTML, CSS and JS, kept here as the visual reference for the build. It isn't served by the site and its photos aren't included.

Open a page in a browser to view it. The photos won't load; everything else will.

| Page in the design                         | Route on the site      |
| ------------------------------------------ | ---------------------- |
| `index.html`                               | `/`                    |
| `about.html`                               | `/about`               |
| `portfolio.html`                           | `/portfolio`           |
| `clown-faces-forearm-tattoo.html` etc      | `/portfolio/[slug]`    |
| `visiting-albania.html`                    | `/visiting-albania`    |
| `blog.html`                                | `/journal`             |
| `tattoo-consultation.html` etc             | `/journal/[slug]`      |
| `contact.html`                             | `/contact`             |

The design has 30 piece pages built from one template. Two are kept here: `clown-faces-forearm-tattoo.html` (two photos and a film) and `peaky-blinders-upper-arm-tattoo.html` (a film only). The pieces' titles, categories, placements and summaries are in `src/seed/content.ts`; the seed downloads their photos and films from the design review (`src/seed/studio-media.ts`).

## Design-review artefacts that are not built

- The "Design review" bar at the top of every page, and the footer disclaimer.
- The hero's "Demo inspiration / not studio work" caption, and the FAQ "Are the tattoos shown here studio work?".
- The enquiry form's "prepare a brief on your device / copy my enquiry" behaviour. The real form sends to the CMS (lead-capture phase).

## Deliberate differences

- Orange buttons use black text: white on #FF5100 fails WCAG AA for small labels.
- Small grey labels use #8F8F8F instead of #666, for contrast.
- `✳`, `▶` and the destination glyphs are drawn as SVG, because iOS shows those characters as colour emoji.
- Photos are black and white by default, as in the design, but Studio details has a switch for colour.
- Homepage sections are numbered in order (01, 02, 03…); the design skips 02 since its video section was folded into the portfolio.
- The homepage colour cycle stops for good once the visitor scrolls, swipes or clicks in the gallery, rather than resuming after a pause (WCAG 2.2.2).
- The Journal's page-top photo is a studio photo; the design uses a demo photo there.
- Each portfolio category has one name, used on the cards and the filter ("Portrait"; the design's filter button says "Portraits").
- Every page is built from page-builder sections (`docs/PAGE_BUILDER.md`), so the owner can rearrange it. The darker bands that the design draws in three shades (`#0b0b0b`, `#0c0c0c`, `#0d0d0d`) with a top line or lines above and below are one "Dark band" background, with lines above and below.
- Under a portfolio piece, the "More work by Tisi" section has no line underneath (the design draws one before the footer).
