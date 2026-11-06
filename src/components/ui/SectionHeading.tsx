import type { ReactNode } from 'react'

import { SplitReveal } from '@/components/motion/SplitReveal'
import { cn } from '@/lib/cn'

import { Eyebrow } from './Eyebrow'

type SectionHeadingProps = {
  id: string
  heading: string
  /** A second sentence shown in grey after the heading. */
  muted?: string | null
  eyebrow?: string | null
  intro?: string | null
  /** A button or link shown to the right on wide screens. */
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Eyebrow, H2 (characters flicker in on enter) and optional intro and action. */
export function SectionHeading({
  id,
  heading,
  muted,
  eyebrow,
  intro,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-5', centered && 'items-center')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SplitReveal as="h2" id={id} muted={muted} className="max-w-[20ch] text-h2">
          {heading}
        </SplitReveal>
        {intro && (
          <p data-reveal="" data-fade="" className="max-w-[52ch] text-large">
            {intro}
          </p>
        )}
      </div>
      {action && (
        <div data-reveal="" data-fade="" className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
