import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type EyebrowProps = {
  children: ReactNode
  /** Dark rounded pill (hero style) instead of a bare label. */
  pill?: boolean
  as?: 'p' | 'span' | 'div'
  className?: string
}

/** Mono uppercase label with the small accent square bullet: "■ CRAFT, HYGIENE & ARTISTRY". */
export function Eyebrow({ children, pill = false, as: Tag = 'p', className }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-2 mono-label text-text',
        pill && 'rounded-full border border-surface-2 bg-surface py-2 pr-4 pl-3',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      {children}
    </Tag>
  )
}
