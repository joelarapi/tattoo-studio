'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'

import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'

gsap.registerPlugin(useGSAP)

/**
 * One listener for the whole page: elements marked `data-reveal data-fade` fade up a little as
 * they enter, in small batches. Keeps the sections themselves server components. Mounted once in
 * the layout and re-run on navigation.
 */
export function FadeReveals() {
  const pathname = usePathname()

  useGSAP(
    () => {
      ensureMotion()
      const elements = gsap.utils.toArray<HTMLElement>('[data-fade]:not([data-revealed])')
      if (prefersReducedMotion()) {
        elements.forEach((el) => (el.dataset.revealed = ''))
        return
      }
      ScrollTrigger.batch(elements, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.set(batch, { opacity: 0, y: 16 })
          batch.forEach((el) => ((el as HTMLElement).dataset.revealed = ''))
          gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, overwrite: true })
        },
      })
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
