import Image from 'next/image'

import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

/**
 * The studio wordmark. Until a real logo is uploaded (Studio details → Logo) this is a
 * placeholder: a needle-and-circle mark plus the studio name set in Roboto Mono.
 */
export function Logo({
  name,
  logo,
  className,
}: {
  name: string
  logo?: Media | number | null
  className?: string
}) {
  if (logo && typeof logo === 'object' && logo.url) {
    return (
      <Image
        src={logo.url}
        alt={name}
        width={logo.width ?? 160}
        height={logo.height ?? 32}
        className={cn('h-7 w-auto', className)}
      />
    )
  }
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-text', className)}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="none">
        <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 1.75V13" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="14" width="4" height="4" fill="var(--color-accent)" />
      </svg>
      <span className="mono-label tracking-wide">{name}</span>
    </span>
  )
}
