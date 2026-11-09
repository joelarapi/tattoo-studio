'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/*
 * One listener for the whole site's scroll motion (styles in globals.css):
 * - `data-reveal` elements fade up once, the first time they scroll into view. Inside a
 *   `data-reveal-group`, siblings follow one another by 65 ms.
 * - `data-stencil` line art draws itself in once.
 * Never put data-reveal on hero content: it would stay hidden until this script runs (LCP).
 */
export function PageMotion() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    // Tells the inline script in the layout that hidden states will be revealed.
    root.classList.add('motion-ready')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')

    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          reveals.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -25px 0px' },
    )
    const drawings = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-drawn', '')
          drawings.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )

    const scan = () => {
      const pendingReveals = document.querySelectorAll<HTMLElement>(
        '[data-reveal]:not([data-revealed])',
      )
      const pendingDrawings = document.querySelectorAll('[data-stencil]:not([data-drawn])')
      if (reduce.matches) {
        pendingReveals.forEach((el) => el.setAttribute('data-revealed', ''))
        pendingDrawings.forEach((el) => el.setAttribute('data-drawn', ''))
        return
      }
      pendingReveals.forEach((el) => {
        const group = el.parentElement?.closest('[data-reveal-group]')
        if (group && el.parentElement === group) {
          const index = [...group.children].indexOf(el)
          el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`)
        }
        // Content already scrolled past (e.g. after a jump to an anchor) shows at once.
        if (el.getBoundingClientRect().bottom < 0) el.setAttribute('data-revealed', '')
        else reveals.observe(el)
      })
      pendingDrawings.forEach((el) => drawings.observe(el))
    }

    scan()
    // Live preview and client navigation can add content later.
    let frame = 0
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(scan)
    })
    mutations.observe(document.body, { childList: true, subtree: true })
    reduce.addEventListener('change', scan)

    return () => {
      reveals.disconnect()
      drawings.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frame)
      reduce.removeEventListener('change', scan)
    }
  }, [pathname])

  return null
}
