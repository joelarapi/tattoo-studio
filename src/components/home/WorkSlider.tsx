'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import Link from 'next/link'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import { CmsImage } from '@/components/ui/CmsImage'
import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'
import type { Media } from '@/payload-types'

import { LoopVideo } from './LoopVideo'

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin)

export type WorkItem = {
  id: number
  title: string
  /** "001" */
  index: string
  href: string
  artist: string
  style: string
  image: Media | null
  video: { url: string; mimeType: string } | null
}

const AUTOPLAY_SECONDS = 5

type SliderApi = { goTo: (index: number) => void }

/**
 * Centred, draggable slider with neighbours peeking in on both sides. It's GSAP Draggable +
 * Inertia, which the site already ships, rather than an extra carousel library. Without JS it's a
 * native horizontally scrolling, snapping row. Arrow keys, prev/next and pause buttons; autoplay
 * stops while hovered, focused, dragged, off screen, or for reduced motion.
 */
export function WorkSlider({ items, label }: { items: WorkItem[]; label: string }) {
  const regionRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const api = useRef<SliderApi | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)
  const count = items.length

  useGSAP(
    () => {
      const viewport = viewportRef.current
      const track = trackRef.current
      if (!viewport || !track || count < 2) return
      ensureMotion()
      setReduced(prefersReducedMotion())

      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', track)
      let step = 1
      let index = 0
      let dragged = false

      const measure = () => {
        step = cards[1].offsetLeft - cards[0].offsetLeft
      }
      // Neighbours shrink and dim with distance from the centre.
      const paint = () => {
        const x = gsap.getProperty(track, 'x') as number
        cards.forEach((card, i) => {
          const distance = Math.min(Math.abs(i * step + x) / step, 1)
          gsap.set(card, { scale: 1 - distance * 0.12, opacity: 1 - distance * 0.6 })
        })
      }
      const settle = (i: number) => {
        index = Math.max(0, Math.min(count - 1, i))
        setActive(index)
      }
      const goTo = (i: number, instant = false) => {
        settle(i)
        gsap.to(track, {
          x: -index * step,
          duration: instant || prefersReducedMotion() ? 0 : 0.9,
          overwrite: true,
          onUpdate: paint,
        })
      }
      api.current = { goTo }

      measure()
      viewport.scrollLeft = 0
      if (count >= 3) goTo(1, true)
      paint()

      const [drag] = Draggable.create(track, {
        type: 'x',
        inertia: !prefersReducedMotion(),
        edgeResistance: 0.85,
        bounds: { minX: -(count - 1) * step, maxX: 0 },
        snap: (value: number) => Math.round(value / step) * step,
        minimumMovement: 6,
        dragClickables: true,
        allowContextMenu: true,
        zIndexBoost: false,
        onDragStart: () => (dragged = true),
        onDrag: paint,
        onThrowUpdate: paint,
        onRelease: () => setTimeout(() => (dragged = false), 0),
        onDragEnd() {
          if (prefersReducedMotion()) goTo(Math.round(-this.x / step))
        },
        onThrowComplete() {
          settle(Math.round(-this.x / step))
        },
      })

      // A drag must not also follow the card's link.
      const blockClickAfterDrag = (event: MouseEvent) => {
        if (dragged) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
      // Tabbing to an off-centre card brings it to the centre (and undoes the browser's own
      // scroll of the overflow-hidden viewport).
      const onFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement
        // Keyboard focus only: a mouse press focuses the link too, and must stay a drag/click.
        if (!target.matches(':focus-visible')) return
        const card = target.closest<HTMLElement>('[data-card]')
        viewport.scrollLeft = 0
        if (card) goTo(cards.indexOf(card))
      }
      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          measure()
          drag.applyBounds({ minX: -(count - 1) * step, maxX: 0 })
          goTo(index, true)
        }, 150)
      }

      track.addEventListener('click', blockClickAfterDrag, true)
      track.addEventListener('focusin', onFocusIn)
      window.addEventListener('resize', onResize)
      const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        threshold: 0.4,
      })
      observer.observe(viewport)

      return () => {
        api.current = null
        drag.kill()
        observer.disconnect()
        clearTimeout(resizeTimer)
        track.removeEventListener('click', blockClickAfterDrag, true)
        track.removeEventListener('focusin', onFocusIn)
        window.removeEventListener('resize', onResize)
      }
    },
    { scope: regionRef, dependencies: [count] },
  )

  // Autoplay: one step every few seconds, back to the start after the last card.
  const autoplay = !paused && !interacting && inView && !reduced && count > 1
  useEffect(() => {
    if (!autoplay) return
    const timer = setTimeout(
      () => api.current?.goTo(active === count - 1 ? 0 : active + 1),
      AUTOPLAY_SECONDS * 1000,
    )
    return () => clearTimeout(timer)
  }, [autoplay, active, count])

  const go = (index: number) => api.current?.goTo(index)

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setInteracting(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(active + 1)
        else if (event.key === 'ArrowLeft') go(active - 1)
        else return
        event.preventDefault()
      }}
    >
      <div
        ref={viewportRef}
        className="snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [.js-ready_&]:overflow-hidden"
        style={{ '--card-w': 'min(30rem, 78vw)' } as CSSProperties}
      >
        <ul
          ref={trackRef}
          aria-live={autoplay ? 'off' : 'polite'}
          className="flex w-max cursor-grab gap-gutter px-[calc(50%-var(--card-w)/2)] active:cursor-grabbing"
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              data-card=""
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className="w-(--card-w) shrink-0 snap-center"
            >
              <Link
                href={item.href}
                draggable={false}
                className="group relative block aspect-[4/5] overflow-hidden rounded-md bg-surface"
              >
                {item.video ? (
                  <LoopVideo
                    src={item.video.url}
                    type={item.video.mimeType}
                    poster={item.image?.url ?? undefined}
                  />
                ) : (
                  <CmsImage
                    media={item.image}
                    fill
                    draggable={false}
                    sizes="(min-width: 640px) 30rem, 78vw"
                    className="object-cover transition-transform duration-700 ease-studio group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.65),transparent_30%,transparent_65%,rgb(0_0_0/0.75))]" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6">
                  <h3 className="max-w-[16ch] text-h5 text-text">{item.title}</h3>
                  <span className="mono-label-sm text-text">{item.index}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6 mono-label-sm text-text">
                  <span>{item.artist}</span>
                  <span className="rounded-full border border-muted bg-bg/70 px-3 py-1.5">
                    {item.style}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {count > 1 && (
        <div className="mt-8 hidden items-center justify-center gap-2 [.js-ready_&]:flex">
          <SliderButton
            label="Previous piece"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <path d="M15 6 9 12l6 6" />
          </SliderButton>
          {!reduced && (
            <SliderButton
              label={paused ? 'Play slideshow' : 'Pause slideshow'}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <path d="m9 6 9 6-9 6Z" /> : <path d="M9 6v12M15 6v12" />}
            </SliderButton>
          )}
          <SliderButton
            label="Next piece"
            disabled={active === count - 1}
            onClick={() => go(active + 1)}
          >
            <path d="m9 6 6 6-6 6" />
          </SliderButton>
          <p aria-hidden="true" className="ml-3 mono-label-sm text-text-muted tabular-nums">
            <span className="text-text">{String(active + 1).padStart(2, '0')}</span> /{' '}
            {String(count).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  )
}

function SliderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-sm bg-surface-2 text-text transition-colors hover:bg-muted disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {children}
      </svg>
    </button>
  )
}
