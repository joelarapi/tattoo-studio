import type { ReactNode } from 'react'

import type { Page, PortfolioItem } from '@/payload-types'

import type { Background } from './settings'

/** Any section a page can hold. */
export type LayoutBlock = NonNullable<Page['layout']>[number]

export type BlockType = LayoutBlock['blockType']

export type BlockOf<T extends BlockType> = Extract<LayoutBlock, { blockType: T }>

export type SectionSettingsValue = {
  background?: Background | null
  anchor?: string | null
  jumpLabel?: string | null
}

/** What a section knows about where it sits. Filled in by RenderBlocks. */
export type BlockContext = {
  /** Its section number ("01 / …"), when the page numbers its sections. */
  number?: number
  /** The page's first section is its title (H1) when the page has no page top. */
  headingAs: 'h1' | 'h2'
  /** Sections with a jump-link label, for the page top's jump bar. */
  jumpLinks: { id: string; label: string }[]
  /** When the page was last updated (the document layout of a Text section can show it). */
  updatedAt?: string
  /** On a portfolio piece's own page: the piece and the whole portfolio. */
  piece?: { item: PortfolioItem; items: PortfolioItem[] }
}

export type BlockProps<T extends BlockType, D = undefined> = {
  block: BlockOf<T>
  /** What the block's `load` fetched. */
  data: D
  ctx: BlockContext
}

export type BlockEntry<T extends BlockType, D = undefined> = {
  Component: (props: BlockProps<T, D>) => ReactNode | Promise<ReactNode>
  /** Fetches what the section lists. Return null when there's nothing to show: it drops out. */
  load?: (block: BlockOf<T>, ctx: Partial<BlockContext>) => Promise<D | null>
  /** A page top: only ever first, and it renders the page's H1. */
  hero?: boolean
  /** Counts in the page's section numbering. */
  numbered?: boolean
}
