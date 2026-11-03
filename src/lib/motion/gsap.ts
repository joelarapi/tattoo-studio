import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** The single site-wide ease. Same curve as the CSS token --ease-studio. */
export const STUDIO_EASE = 'studio'

let registered = false

/**
 * Registers the core plugins every animated page needs (ScrollTrigger, CustomEase) and the
 * studio defaults. Heavier plugins (SplitText, ScrambleText, DrawSVG, Draggable, Inertia) are
 * registered by the components that use them, so they only ship where they are used.
 * Call from client effects only.
 */
export function ensureMotion(): typeof gsap {
  if (registered) return gsap
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create(STUDIO_EASE, '0.625, 0.05, 0, 1')
  gsap.defaults({ duration: 0.6, ease: STUDIO_EASE })
  registered = true
  return gsap
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export { gsap, ScrollTrigger }
