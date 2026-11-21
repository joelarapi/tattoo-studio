import type { Metadata } from 'next'

import { Action } from '@/components/ui/Action'
import { MobileCta } from '@/components/motion/MobileCta'
import { getPortfolioItems, getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { pathForDoc } from '@/lib/routes'
import type { Media, Page, PortfolioItem } from '@/payload-types'

import { RenderBlocks } from './RenderBlocks'
import { layoutSummary } from './summary'

type PageBlock = NonNullable<Page['layout']>[number]

// These are existing portfolio entries, not separate images or copies of CMS content.
// A matching CMS "More portfolio pieces" block takes precedence over this fallback.
const visitingPortfolioPicks = [
  { slug: 'grim-reaper-full-back-tattoo', title: /grim reaper.*back/i },
  { slug: 'family-memory-full-sleeve-tattoo', title: /family.*full sleeve/i },
  { slug: 'lion-cub-family-sleeve-tattoo', title: /lion.*cub.*sleeve/i },
  { slug: 'archangel-mary-full-sleeve-tattoo', title: /archangel.*mary.*sleeve/i },
  { slug: 'lion-compass-forearm-tattoo', title: /lion.*compass.*forearm/i },
  { slug: 'winged-warrior-arm-tattoo', title: /winged.*(angel|warrior).*sleeve/i },
]

function hasPortfolioImage(item: PortfolioItem): boolean {
  return (
    Boolean(item.images?.some((image) => typeof image === 'object' && image.url)) ||
    (typeof item.videoPoster === 'object' && Boolean(item.videoPoster?.url))
  )
}

/**
 * Show a few real arm and back tattoos directly after "The tattoo comes first".
 * The pieces, photos, alt text, titles and placements all come from the live CMS.
 * An editor can replace this with a CMS-managed section using the same anchor.
 */
async function withVisitingPortfolio(page: Page): Promise<Page['layout']> {
  const blocks = page.layout
  if (page.slug !== 'visiting-albania' || !blocks?.length) return blocks

  const planIndex = blocks.findIndex(
    (block) => block.blockType === 'cards' && block.settings?.anchor === 'plan',
  )
  const hasCmsGallery = blocks.some(
    (block) =>
      block.blockType === 'pieceSuggestions' && block.settings?.anchor === 'visiting-portfolio',
  )
  if (planIndex === -1 || hasCmsGallery) return blocks

  const items = (await getPortfolioItems()).filter(hasPortfolioImage)
  // Match current CMS titles first, since editors may improve a piece's SEO slug.
  // Fall back to the original portfolio slug, but never substitute an unrelated tattoo.
  const selected = visitingPortfolioPicks
    .map(({ slug, title }) =>
      items.find((item) => title.test(item.title)) ?? items.find((item) => item.slug === slug),
    )
    .filter((item): item is PortfolioItem => Boolean(item))
  const pieces = selected.filter(
    (item, index) => selected.findIndex((other) => other.id === item.id) === index,
  )
  if (!pieces.length) return blocks

  const gallery: Extract<PageBlock, { blockType: 'pieceSuggestions' }> = {
    blockType: 'pieceSuggestions',
    id: 'visiting-albania-portfolio-gallery',
    tag: 'Selected arm & back tattoos',
    heading: { text: 'See the work.', soft: 'Find your inspiration.' },
    button: { label: 'View the full portfolio', href: '/portfolio' },
    cardLink: 'Explore this tattoo',
    pieces,
    settings: { anchor: 'visiting-portfolio', background: 'line' },
  }

  return [...blocks.slice(0, planIndex + 1), gallery, ...blocks.slice(planIndex + 1)]
}

/** A page from Pages: its sections, and the pinned phone button if it has one. */
export async function PageView({ page }: { page: Page }) {
  const layout = await withVisitingPortfolio(page)
  const mobileCta = page.mobileCta
  return (
    <main id="main">
      <RenderBlocks
        blocks={layout}
        numberSections={page.numberSections}
        context={{ updatedAt: page.updatedAt }}
      />
      {page.slug === 'visiting-albania' && (
        <nav aria-label="Tattoo travel guides" className="flex flex-wrap gap-6 px-site pb-section">
          <Action href="/visiting-albania/from-italy" variant="plain">
            Travelling from Italy
          </Action>
          <Action href="/visit/from-germany" variant="plain">
            Travelling from Germany
          </Action>
          <Action href="/visit/from-poland" variant="plain">
            Travelling from Poland
          </Action>
        </nav>
      )}
      {page.slug === 'portfolio' && (
        <div className="px-site pb-section">
          <Action href="/services/geometric-tattoo" variant="plain">
            Explore geometric tattoo designs
          </Action>
        </div>
      )}
      {mobileCta?.label && mobileCta.href && (
        <MobileCta label={mobileCta.label} href={mobileCta.href} />
      )}
    </main>
  )
}

/** Title, description and share image from the SEO tab, falling back to the page's sections. */
export async function pageViewMetadata(page: Page): Promise<Metadata> {
  const settings = await getSiteSettings()
  const summary = layoutSummary(page.layout)
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: summary.heading || page.title,
    fallbackDescription: summary.intro,
    image: summary.image as number | Media | null | undefined,
    path: pathForDoc('pages', page.slug),
  })
}
