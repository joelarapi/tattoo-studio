import type { Metadata } from 'next'

import { Action } from '@/components/ui/Action'
import { MobileCta } from '@/components/motion/MobileCta'
import { getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { pathForDoc } from '@/lib/routes'
import type { Media, Page } from '@/payload-types'

import { RenderBlocks } from './RenderBlocks'
import { layoutSummary } from './summary'

/** A page from Pages: its sections, and the pinned phone button if it has one. */
export function PageView({ page }: { page: Page }) {
  const mobileCta = page.mobileCta
  return (
    <main id="main">
      <RenderBlocks
        blocks={page.layout}
        numberSections={page.numberSections}
        context={{ updatedAt: page.updatedAt }}
      />
      {page.slug === 'visiting-albania' && (
        <nav aria-label="Tattoo travel guides" className="flex flex-wrap gap-6 px-site pb-section">
          <Action href="/visit/from-italy" variant="plain">Travelling from Italy</Action>
          <Action href="/visit/from-germany" variant="plain">Travelling from Germany</Action>
        </nav>
      )}
      {page.slug === 'portfolio' && (
        <div className="px-site pb-section">
          <Action href="/services/geometric-tattoo" variant="plain">Explore geometric tattoo designs</Action>
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
