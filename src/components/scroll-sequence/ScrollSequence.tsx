'use client'

import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { type CSSProperties, useRef, useState } from 'react'

import { SplitReveal } from '@/components/motion/SplitReveal'
import { cn } from '@/lib/cn'
import { ensureMotion, gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion/gsap'

import { drawCover, FrameLoader } from './frames'
import { isSequenceName, type SequenceManifest, sequenceBase } from './manifest'
import { paintProgress, ProgressIndicator } from './ProgressIndicator'

gsap.registerPlugin(useGSAP)

export type SequenceStep = {
  label?: string | null
  heading: string
  text: string
}

type ScrollSequenceProps = {
  /** Folder in public/sequences, e.g. "placeholder". */
  name: string
  steps: SequenceStep[]
  /** Total scroll length. Defaults to 100 per step (400 for four steps). */
  heightVh?: number
  className?: string
  /** Replaces the sequence's own poster.avif (e.g. a still chosen in the CMS). */
  posterSrc?: string | null
  /** Load the poster eagerly with high priority. Turn off when the sequence starts below the fold. */
  priority?: boolean
}

type NetworkInformation = { saveData?: boolean }

const MOBILE_QUERY = '(max-width: 767px)'

/**
 * Scroll-scrubbed frame animation with the process steps on top.
 *
 * A tall wrapper holds a sticky, full-height stage. The stage shows the poster (a normal
 * `next/image`, so it's the LCP image and what no-JS visitors see) and a canvas that fades in
 * over it once frames decode. Scroll progress picks the frame; frames load progressively from
 * about one viewport away. The steps are real HTML that scroll past on the left (desktop) or
 * dock at the bottom over a scrim (mobile). Reduced motion gets the poster and a plain list;
 * Save-Data gets the poster without loading frames.
 *
 * To swap in new footage: render a 6–10 s clip on pure black (subject centred, 1080p or more,
 * no text), run `pnpm sequence:extract <video.mp4> <name>`, then set Homepage → Process →
 * "sequence" to <name> in the CMS. See README → "Process animation".
 */
export function ScrollSequence({
  name,
  steps,
  heightVh,
  className,
  posterSrc,
  priority = true,
}: ScrollSequenceProps) {
  const sequence = isSequenceName(name) ? name : 'placeholder'
  const base = sequenceBase(sequence)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeStep, setActiveStep] = useState(-1)

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const stage = stageRef.current
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d', { alpha: false })
      const indicator = wrapper?.querySelector<HTMLElement>('[data-progress]')
      if (!wrapper || !stage || !canvas || !ctx || prefersReducedMotion()) return
      ensureMotion()

      const isMobile = window.matchMedia(MOBILE_QUERY).matches
      const saveData =
        (navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData === true

      let loader: FrameLoader | null = null
      let disposed = false
      let progress = 0
      let drawnIndex = -1
      let raf = 0
      let entered = false
      let step = -1

      const targetIndex = () => (loader ? Math.round(progress * (loader.count - 1)) : 0)

      const draw = () => {
        raf = 0
        const hit = loader?.nearest(targetIndex())
        if (!hit || hit.index === drawnIndex) return
        drawCover(ctx, hit.frame)
        drawnIndex = hit.index
        canvas.dataset.ready = ''
      }
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(draw)
      }

      const updateStep = () => {
        if (!entered) return
        const next = Math.min(steps.length - 1, Math.floor(progress * steps.length))
        if (next !== step) {
          step = next
          setActiveStep(next)
        }
        if (indicator) paintProgress(indicator, progress, step)
      }

      // Backing store = CSS size × DPR (capped at 1.5, and 1 on mobile, to bound memory and fill rate).
      const resize = () => {
        const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
        const width = Math.round(stage.clientWidth * dpr)
        const height = Math.round(stage.clientHeight * dpr)
        if (canvas.width === width && canvas.height === height) return false
        canvas.width = width
        canvas.height = height
        drawnIndex = -1
        schedule()
        return true
      }
      resize()

      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          if (resize()) ScrollTrigger.refresh()
        }, 200)
      }
      window.addEventListener('resize', onResize)

      // Scroll → progress, smoothed by `scrub`. Steps and the indicator work even without frames.
      const proxy = { progress: 0 }
      gsap.to(proxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.6 : 0.5,
        },
        onUpdate: () => {
          progress = proxy.progress
          if (targetIndex() !== drawnIndex) schedule()
          updateStep()
        },
      })
      // Steps start revealing once the section is well into view, not while it's still far below.
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          entered = true
          updateStep()
        },
      })

      // Frames: start loading about one viewport before the section arrives (skipped on Save-Data).
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer.disconnect()
          void startLoading()
        },
        { rootMargin: '100% 0px 100% 0px' },
      )
      if (!saveData) observer.observe(wrapper)

      async function startLoading() {
        const res = await fetch(`${base}/manifest.json`).catch(() => null)
        if (!res?.ok || disposed) return
        const manifest = (await res.json()) as SequenceManifest
        if (disposed) return
        loader = new FrameLoader({
          path: isMobile ? manifest.mobilePath : manifest.desktopPath,
          count: isMobile ? manifest.mobile.frameCount : manifest.frameCount,
          ext: manifest.ext,
          fallbackExt: manifest.fallbackExt,
          // Redraw when a frame lands that's closer to where the scroll is than what's shown.
          onLoad: (index) => {
            const target = targetIndex()
            if (drawnIndex === -1 || Math.abs(index - target) < Math.abs(drawnIndex - target)) {
              schedule()
            }
          },
        })
        void loader.start()
      }

      return () => {
        disposed = true
        observer.disconnect()
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
        cancelAnimationFrame(raf)
        loader?.dispose()
      }
    },
    { dependencies: [base, steps.length], scope: wrapperRef, revertOnUpdate: true },
  )

  return (
    <div
      ref={wrapperRef}
      className={cn('relative h-(--seq-height) motion-reduce:h-auto', className)}
      style={{ '--seq-height': `${heightVh ?? steps.length * 100}svh` } as CSSProperties}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:h-[60svh]"
      >
        <div className="absolute inset-0">
          <Image
            src={posterSrc || `${base}/poster.avif`}
            alt=""
            fill
            sizes="100vw"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="object-cover"
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 data-ready:opacity-100"
          />
        </div>
        {/* Legibility: a bottom scrim under the docked steps on mobile, a left one on desktop. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-bg via-bg/70 to-transparent motion-reduce:hidden md:inset-y-0 md:right-auto md:h-auto md:w-3/5 md:bg-linear-to-r md:from-bg/90 md:via-bg/40"
        />
        <ProgressIndicator
          steps={steps.length}
          className="absolute top-[calc(var(--nav-height)+1rem)] left-1/2 hidden -translate-x-1/2 md:top-auto md:bottom-8 motion-safe:[.js-ready_&]:flex"
        />
      </div>

      <ol
        className={cn(
          // One row per step, each as tall as its share of the scroll (the wrapper minus one
          // screen), so a step's row lines up with its quarter of the progress.
          'absolute inset-x-0 flex h-[calc(var(--seq-height)-100svh)] flex-col',
          // Mobile: rows start just above the docking spot, so step N docks exactly as its
          // quarter begins. Desktop: a row's centre crosses mid-screen mid-quarter.
          'top-[calc(100svh-2rem)] md:top-[50svh]',
          'motion-reduce:static motion-reduce:grid motion-reduce:h-auto motion-reduce:gap-12 motion-reduce:py-section md:motion-reduce:grid-cols-2',
        )}
      >
        {steps.map((s, i) => (
          <li
            key={i}
            data-active={activeStep === i ? '' : undefined}
            className={cn(
              'flex flex-1 items-end motion-reduce:flex-none motion-reduce:items-start md:items-center',
              // Mobile with JS: only the docked (active) step shows; the one leaving fades out
              // instead of sliding up across the animation. Without JS all stay readable.
              'transition-opacity duration-300 max-md:motion-safe:[.js-ready_&]:not-data-active:opacity-0',
            )}
          >
            {/* Mobile: sticky to the bottom, so each step docks there and hands over to the next. */}
            <div className="sticky bottom-8 mx-auto w-full max-w-site px-site-margin motion-reduce:static md:static">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 mono-label-sm text-text-muted">
                  <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
                  {String(i + 1).padStart(2, '0')}
                  {s.label ? ` · ${s.label}` : ''}
                </p>
                <SplitReveal
                  as="h3"
                  variant="flicker"
                  play={activeStep === i}
                  className="mt-4 text-h3"
                >
                  {s.heading}
                </SplitReveal>
                <SplitReveal
                  variant="scramble"
                  play={activeStep === i}
                  className="mt-4 max-w-[38ch] text-large"
                >
                  {s.text}
                </SplitReveal>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
