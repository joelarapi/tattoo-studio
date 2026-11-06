'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type ReactNode, useRef } from 'react'

import { cn } from '@/lib/cn'
import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'

gsap.registerPlugin(useGSAP, DrawSVGPlugin)

const SHAPES = 'path, circle, line, polyline, polygon, rect, ellipse'

type LineArtProps = {
  children: ReactNode
  /** `load`: draw as soon as JS runs (hero). `enter`: draw when scrolled into view. */
  trigger?: 'load' | 'enter'
  duration?: number
  stagger?: number
  className?: string
}

/**
 * Decorative SVG line art that draws itself in (DrawSVG). Shapes inside `[data-no-draw]` (e.g.
 * filled accent squares, CSS-animated beams) are left alone. Without JS or with reduced motion
 * the art is simply shown.
 */
export function LineArt({
  children,
  trigger = 'enter',
  duration = 1.8,
  stagger = 0.03,
  className,
}: LineArtProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      ensureMotion()
      const shapes = [...root.querySelectorAll<SVGElement>(SHAPES)].filter(
        (shape) => !shape.closest('[data-no-draw]'),
      )
      const draw = () => {
        root.dataset.revealed = ''
        if (prefersReducedMotion() || shapes.length === 0) return
        gsap.fromTo(shapes, { drawSVG: '0%' }, { drawSVG: '100%', duration, stagger })
      }
      if (trigger === 'load') draw()
      else ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: draw })
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-reveal=""
      className={cn('pointer-events-none', className)}
    >
      {children}
    </div>
  )
}
