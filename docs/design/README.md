# Design reference

The approved design for the site, saved from the design review at
https://londonink-tattoo-design-review.cubii.chatgpt.site (November 2026). It is static HTML, CSS and JS, kept here as the visual reference for the build. It isn't served by the site and its photos aren't included.

Open a page in a browser to view it. The photos won't load; everything else will.

| Page in the design             | Route on the site      |
| ------------------------------ | ---------------------- |
| `index.html`                   | `/`                    |
| `about.html`                   | `/about`               |
| `portfolio.html`               | `/portfolio`           |
| `graphic-back-tattoo.html` etc | `/portfolio/[slug]`    |
| `visiting-albania.html`        | `/visiting-albania`    |
| `blog.html`                    | `/journal`             |
| `tattoo-consultation.html` etc | `/journal/[slug]`      |
| `contact.html`                 | `/contact`             |

## Design-review artefacts that are not built

- The "Design preview" bar at the top of every page.
- "Demo inspiration" badges, captions and disclaimers about demo photography, and the image credits page.
- The enquiry form's "prepare a brief on your device / copy my enquiry" behaviour. The real form sends to the CMS (lead-capture phase).

## Deliberate differences

- Orange buttons use black text: white on #FF5100 fails WCAG AA for small labels.
- Small grey labels use #8F8F8F instead of #666, for contrast.
- `✳`, `▶` and the destination glyphs are drawn as SVG, because iOS shows those characters as colour emoji.
- Photos are black and white by default, as in the design, but Studio details has a switch for colour.
