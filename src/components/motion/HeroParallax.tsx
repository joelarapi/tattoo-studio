'use client'

import { useEffect } from 'react'

/**
 * Moves the two homepage hero images a few pixels apart as the page scrolls (CSS variables read by
 * the images' transforms). Off for reduced motion.
 */
export function HeroParallax({ target }: { target: string }) {
  useEffect(() => {
    const hero = document.getElementById(target)
    if (!hero) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const paint = () => {
      frame = 0
      const rect = hero.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top > innerHeight) return
      const distance = Math.max(0, -rect.top)
      const mobile = innerWidth <= 680
      hero.style.setProperty('--primary-shift', `${Math.min(mobile ? 14 : 30, distance * 0.045)}px`)
      hero.style.setProperty(
        '--secondary-shift',
        `${-Math.min(mobile ? 10 : 22, distance * 0.032)}px`,
      )
    }
    const onScroll = () => {
      if (!reduce.matches && !frame) frame = requestAnimationFrame(paint)
    }
    const onPreference = () => {
      if (!reduce.matches) return onScroll()
      hero.style.removeProperty('--primary-shift')
      hero.style.removeProperty('--secondary-shift')
    }

    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll, { passive: true })
    reduce.addEventListener('change', onPreference)
    onScroll()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      reduce.removeEventListener('change', onPreference)
      cancelAnimationFrame(frame)
    }
  }, [target])

  return null
}
