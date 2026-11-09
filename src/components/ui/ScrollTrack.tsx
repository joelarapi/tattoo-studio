'use client'

import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

type ScrollTrackProps = {
  /** Small label above the track, e.g. "Photos · scroll at your own pace". */
  label?: string | null
  /** What the track holds, for screen readers, e.g. "Tattoo photography". */
  ariaLabel: string
  /**
   * Let one black-and-white photo at a time show its colours, moving on every few seconds (the
   * homepage photo track). See `useColourCycle`.
   */
  colourCycle?: boolean
  children: ReactNode
  className?: string
}

const CYCLE_MS = 3500

/**
 * Marks one card at a time `data-colour-active` (CSS in globals.css lifts the grey filter) and
 * scrolls the track to it when it's out of view. It waits while the track is off screen, hovered
 * or focused, never runs with reduced motion, and stops for good as soon as the visitor scrolls,
 * swipes, clicks or types in the track, so it never fights them.
 */
function useColourCycle(
  track: RefObject<HTMLDivElement | null>,
  stopped: RefObject<boolean>,
  enabled: boolean,
) {
  useEffect(() => {
    const el = track.current
    if (!enabled || !el) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = matchMedia('(hover: hover)')
    let index = 0
    let visible = false

    // Read the cards on every step: live preview can change them.
    const show = (next: number, scroll: boolean) => {
      const cards = [...el.children] as HTMLElement[]
      if (!cards.length) return
      index = next % cards.length
      cards.forEach((card, i) => card.toggleAttribute('data-colour-active', i === index))
      const card = cards[index]
      const left = card.offsetLeft - cards[0].offsetLeft
      if (
        scroll &&
        (left < el.scrollLeft || left + card.offsetWidth > el.scrollLeft + el.clientWidth)
      )
        el.scrollTo({ left, behavior: 'smooth' })
    }

    const stop = () => {
      stopped.current = true
    }
    const events = ['pointerdown', 'wheel', 'keydown', 'touchstart'] as const
    events.forEach((type) => el.addEventListener(type, stop, { passive: true }))
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    show(0, false)
    const timer = setInterval(() => {
      if (stopped.current || reduced.matches || !visible || document.hidden) return
      if ((canHover.matches && el.matches(':hover')) || el.contains(document.activeElement)) return
      show(index + 1, true)
    }, CYCLE_MS)

    return () => {
      clearInterval(timer)
      observer.disconnect()
      events.forEach((type) => el.removeEventListener(type, stop))
    }
  }, [track, stopped, enabled])
}

/**
 * A row of cards people scroll sideways at their own pace, with no hijacking. Without JS it is a
 * plain scroll-snap row; with JS the arrow buttons move one card at a time and switch off at either
 * end.
 */
export function ScrollTrack({
  label,
  ariaLabel,
  colourCycle = false,
  children,
  className,
}: ScrollTrackProps) {
  const track = useRef<HTMLDivElement>(null)
  const cycleStopped = useRef(false)
  const [edges, setEdges] = useState({ start: true, end: false })
  useColourCycle(track, cycleStopped, colourCycle)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setEdges({ start: el.scrollLeft < 2, end: el.scrollLeft >= max - 2 })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const resize = new ResizeObserver(update)
    resize.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      resize.disconnect()
    }
  }, [])

  const move = (direction: 1 | -1) => {
    cycleStopped.current = true
    const el = track.current
    const card = el?.firstElementChild
    if (!el || !card) return
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * distance, behavior: reduce ? 'instant' : 'smooth' })
  }

  const button =
    'h-[38px] w-[38px] rounded-sm border border-[#444] bg-panel-2 text-[20px] text-text transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-[#444] disabled:hover:text-text md:h-[42px] md:w-[46px]'

  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-between gap-2.5 md:gap-5">
        <span className="max-w-[65%] label-xs leading-[1.8] text-faint md:max-w-none">{label}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={button}
            aria-label="Previous"
            disabled={edges.start}
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className={button}
            aria-label="Next"
            disabled={edges.end}
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={track}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        data-reveal-group
        data-colour-cycle={colourCycle ? '' : undefined}
        className={cn(
          'flex snap-x snap-proximity items-start gap-[15px] overflow-x-auto overscroll-x-contain pb-[23px] md:gap-[22px]',
          '[scrollbar-width:thin] [scrollbar-color:var(--color-accent)_#222] focus-visible:outline-1 focus-visible:outline-offset-[6px]',
          '[&>*]:shrink-0 [&>*]:basis-[86%] [&>*]:snap-start md:[&>*]:basis-[calc((100%-44px)/3)]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
