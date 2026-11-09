import type { ReactNode } from 'react'

import { ENQUIRY_ID } from '@/lib/routes'

import { registry } from './registry'
import type {
  BlockContext,
  BlockEntry,
  BlockType,
  LayoutBlock,
  SectionSettingsValue,
} from './types'

type Props = {
  blocks: LayoutBlock[] | null | undefined
  /** The page's "Number the sections" option. */
  numberSections?: boolean | null
  /**
   * Whether the first section's heading is the page title (H1) when there's no page top. False
   * under a portfolio piece or article, whose template already has the title.
   */
  titleFromFirst?: boolean
  context?: Partial<Pick<BlockContext, 'piece' | 'updatedAt'>>
}

type Renderable = (props: { block: LayoutBlock; data: unknown; ctx: BlockContext }) => ReactNode

const settingsOf = (block: LayoutBlock): SectionSettingsValue | null =>
  'settings' in block ? (block.settings ?? null) : null

/**
 * A page's sections, top to bottom. First every section fetches what it lists (in parallel);
 * sections with nothing to show drop out, and the rest are numbered in order.
 */
export async function RenderBlocks({
  blocks,
  numberSections,
  titleFromFirst = true,
  context = {},
}: Props) {
  const loaded = await Promise.all(
    (blocks ?? []).map(async (block) => {
      const entry = registry[block.blockType] as BlockEntry<BlockType, unknown> | undefined
      if (!entry) return null
      const data = entry.load ? await entry.load(block as never, context) : undefined
      return data === null ? null : { block, entry, data }
    }),
  )
  const shown = loaded.filter((item) => item !== null)

  const jumpLinks = shown.flatMap(({ block }) => {
    const settings = settingsOf(block)
    const id = block.blockType === 'enquiry' ? ENQUIRY_ID : settings?.anchor
    return id && settings?.jumpLabel ? [{ id, label: settings.jumpLabel }] : []
  })
  const startsWithHero = Boolean(shown[0]?.entry.hero)
  let count = 0

  return shown.map(({ block, entry, data }, index) => {
    const Component = entry.Component as Renderable
    const ctx: BlockContext = {
      ...context,
      number: numberSections && entry.numbered ? ++count : undefined,
      headingAs: titleFromFirst && index === 0 && !startsWithHero ? 'h1' : 'h2',
      jumpLinks,
    }
    return <Component key={block.id ?? index} block={block} data={data} ctx={ctx} />
  })
}
