import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** "01 / …" from a 1-based position. */
export const sectionNumber = (position: number) => String(position).padStart(2, '0')

/** The small orange label above a heading, optionally numbered ("01 / Explore the portfolio"). */
export function Tag({
  children,
  number,
  className,
}: {
  children: ReactNode
  number?: number
  className?: string
}) {
  if (!children) return null
  return (
    <span className={cn('tag', className)}>
      {number != null && `${sectionNumber(number)} / `}
      {children}
    </span>
  )
}
