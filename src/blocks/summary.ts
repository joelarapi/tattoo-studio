import { headingText, type HeadingValue } from '@/lib/heading'

type Relation = number | { id: number } | null | undefined

type SummaryBlock = {
  blockType?: string
  heading?: HeadingValue
  intro?: unknown
  background?: Relation
  primaryImage?: Relation
  image?: Relation
}

/**
 * What a page's sections say about it, for titles, descriptions and share images when its SEO
 * tab is empty: the first heading, the first intro and the page top's photo.
 */
export function layoutSummary(layout: unknown): {
  heading: string
  intro: string
  image: Relation
} {
  const blocks = (Array.isArray(layout) ? layout : []) as SummaryBlock[]
  const first = blocks[0]
  const heading = blocks.map((block) => headingText(block.heading)).find(Boolean) ?? ''
  // Some sections' `intro` is a group (the portfolio grid's), not text.
  const intro =
    blocks
      .map((block) => (typeof block.intro === 'string' ? block.intro.trim() : ''))
      .find(Boolean) ?? ''
  return { heading, intro, image: first?.background ?? first?.primaryImage ?? first?.image }
}
