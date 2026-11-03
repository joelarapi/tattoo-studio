'use client'

import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'

import { ensureMotion, gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { setLenis } from '@/lib/motion/lenis'

/**
 * Site-wide motion setup: registers the GSAP core and runs Lenis smooth scroll on the GSAP
 * ticker so ScrollTrigger stays in sync. Lenis is switched off (and back on) live when the
 * visitor's reduced-motion preference changes.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureMotion()
    document.documentElement.classList.add('motion-ready')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | null = null
    const raf = (time: number) => lenis?.raf(time * 1000)

    const start = () => {
      if (lenis) return
      lenis = new Lenis({ anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      setLenis(lenis)
    }

    const stop = () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
      setLenis(null)
    }

    const sync = () => (reduceMotion.matches ? stop() : start())
    sync()
    reduceMotion.addEventListener('change', sync)

    return () => {
      reduceMotion.removeEventListener('change', sync)
      stop()
    }
  }, [])

  return children
}
