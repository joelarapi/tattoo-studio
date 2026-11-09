import type { Metadata } from 'next'

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
