'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef } from 'react'

import { cn } from '@/lib/cn'
import { getLenis } from '@/lib/motion/lenis'

type DisclosureProps = {
  summary: ReactNode
  summaryLabel?: string
  summaryClassName?: string
  className?: string
  children: ReactNode
  /** Full-screen panels (the mobile menu) also lock page scrolling while open. */
  lockScroll?: boolean
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
  lockScroll = false,
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
    const onToggle = () => {
      if (!lockScroll) return
      const lenis = getLenis()
      if (details.open) {
        lenis?.stop()
        document.documentElement.style.overflow = 'hidden'
      } else {
        lenis?.start()
        document.documentElement.style.overflow = ''
      }
    }

    details.addEventListener('keydown', onKeyDown)
    details.addEventListener('click', onClick)
    details.addEventListener('toggle', onToggle)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      details.removeEventListener('keydown', onKeyDown)
      details.removeEventListener('click', onClick)
      details.removeEventListener('toggle', onToggle)
      document.removeEventListener('pointerdown', onPointerDown)
      if (lockScroll) {
        getLenis()?.start()
        document.documentElement.style.overflow = ''
      }
    }
  }, [lockScroll])

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
