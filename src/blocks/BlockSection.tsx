import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import type { Background } from './settings'
import type { SectionSettingsValue } from './types'

const backgrounds: Record<Background, string> = {
  plain: '',
  line: 'border-t border-line',
  lines: 'border-y border-line',
  band: 'border-y border-line bg-band',
  grid: 'grid-bg overflow-hidden',
}

/**
 * The `<section>` around a page-builder block: its ID (for #links), its background from
 * "Section settings", and `data-block` for tests and the admin thumbnails.
 */
export function BlockSection({
  block,
  id = block.settings?.anchor || undefined,
  className,
  children,
}: {
  block: { blockType: string; settings?: SectionSettingsValue | null }
  /** Overrides the section ID (the enquiry form always has its own). */
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-block={block.blockType}
      className={cn(
        id && 'scroll-mt-5',
        backgrounds[block.settings?.background ?? 'plain'],
        className,
      )}
    >
      {children}
    </section>
  )
}
