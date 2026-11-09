'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

type ScrollTrackProps = {
  /** Small label above the track, e.g. "Photos · scroll at your own pace". */
  label?: string | null
  /** What the track holds, for screen readers, e.g. "Tattoo photography". */
  ariaLabel: string
  children: ReactNode
  className?: string
}

/**
 * A row of cards people scroll sideways at their own pace: no autoplay, no hijacking. Without JS
 * it is a plain scroll-snap row; with JS the arrow buttons move one card at a time and switch off
 * at either end.
 */
export function ScrollTrack({ label, ariaLabel, children, className }: ScrollTrackProps) {
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

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
