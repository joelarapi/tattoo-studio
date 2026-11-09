'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef } from 'react'

import { cn } from '@/lib/cn'

type DisclosureProps = {
  summary: ReactNode
  summaryLabel?: string
  summaryClassName?: string
  className?: string
  children: ReactNode
}

/**
 * A `<details>` menu: opens and closes without JS. With JS it also closes on Escape (returning
 * focus to its button), on outside clicks, when a link inside is followed and on navigation, and
 * the arrow keys move between its links.
 */
export function Disclosure({
  summary,
  summaryLabel,
  summaryClassName,
  className,
  children,
}: DisclosureProps) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const details = ref.current
    if (details) details.open = false
  }, [pathname])

  useEffect(() => {
    const details = ref.current
    if (!details) return
    const summaryEl = details.querySelector('summary')
    const close = (refocus: boolean) => {
      if (!details.open) return
      details.open = false
      if (refocus) summaryEl?.focus()
    }
    const links = () => [...details.querySelectorAll<HTMLAnchorElement>('a[href]')]

    const onKeyDown = (event: KeyboardEvent) => {
      if (!details.open) return
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      const items = links()
      if (!items.length) return
      event.preventDefault()
      const current = items.indexOf(document.activeElement as HTMLAnchorElement)
      const step = event.key === 'ArrowDown' ? 1 : -1
      items[(current + step + items.length) % items.length].focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!details.contains(event.target as Node)) close(false)
    }
    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a[href]')) close(false)
    }

    details.addEventListener('keydown', onKeyDown)
    details.addEventListener('click', onClick)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      details.removeEventListener('keydown', onKeyDown)
      details.removeEventListener('click', onClick)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  return (
    <details ref={ref} className={cn('group', className)}>
      <summary
        aria-label={summaryLabel}
        className={cn('cursor-pointer select-none', summaryClassName)}
      >
        {summary}
      </summary>
      {children}
    </details>
  )
}
