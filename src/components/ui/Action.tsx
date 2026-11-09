import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type CmsLink = { label?: string | null; href?: string | null } | null | undefined

type Variant = 'accent' | 'outline' | 'plain' | 'text'

const variants: Record<Variant, string> = {
  accent: 'btn btn-accent',
  outline: 'btn btn-outline',
  plain: 'link-plain',
  text: 'link-text',
}

// VS15 keeps the arrows as text: some phones would otherwise draw them as emoji.
const arrows = { out: ' ↗︎', down: ' ↓︎', back: '← ', none: '' } as const

type ActionProps = {
  link?: CmsLink
  href?: string
  children?: ReactNode
  variant?: Variant
  arrow?: keyof typeof arrows
  className?: string
}

/**
 * A button or link from the CMS. Site paths use client navigation, `#anchors` and `mailto:` /
 * `tel:` links are plain anchors, and other websites open in a new tab. Renders nothing without
 * both a label and a destination.
 */
export function Action({
  link,
  href = link?.href ?? undefined,
  children = link?.label,
  variant = 'accent',
  arrow = 'out',
  className,
}: ActionProps) {
  if (!href || !children) return null
  const classes = cn(variants[variant], className)
  const content = (
    <>
      {arrow === 'back' && arrows.back}
      {children}
      {arrow !== 'back' && arrows[arrow]}
    </>
  )

  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  )
}
