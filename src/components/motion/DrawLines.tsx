'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type ReactNode, useRef } from 'react'

import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'

gsap.registerPlugin(useGSAP)

/**
 * Draws hairline grid borders in when the grid enters the viewport. Mark each line with
 * `data-line="x"` (grows left to right) or `data-line="y"` (top to bottom) plus `data-reveal`,
 * which keeps it hidden until it draws (only once JS runs).
 */
export function DrawLines({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      ensureMotion()
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]', root)
      ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          lines.forEach((line) => (line.dataset.revealed = ''))
          if (prefersReducedMotion()) return
          lines.forEach((line, i) => {
            const axis = line.dataset.line === 'y' ? 'scaleY' : 'scaleX'
            gsap.fromTo(line, { [axis]: 0 }, { [axis]: 1, duration: 1, delay: i * 0.06 })
          })
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
