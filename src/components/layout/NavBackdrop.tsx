'use client'

import { useEffect, useRef } from 'react'

/**
 * The nav is transparent over the hero and gets a dark, blurred backdrop once the page scrolls.
 * It's a separate layer (not a filter on the header) so the full-screen mobile menu, which is
 * `position: fixed` inside the header, still covers the whole screen.
 */
export function NavBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => el.toggleAttribute('data-scrolled', window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-bg/85 opacity-0 backdrop-blur-md transition-opacity duration-300 data-scrolled:opacity-100"
    />
  )
}
