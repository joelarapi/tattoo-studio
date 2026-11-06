'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { type ElementType, Fragment, useRef } from 'react'

import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'

gsap.registerPlugin(useGSAP, SplitText, ScrambleTextPlugin)

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

type SplitRevealProps = {
  /** The text. A "\n" starts a new line (flicker only). */
  children: string
  as?: Tag
  /** `flicker`: characters blink in in random order (headings). `scramble`: text decodes left to right (paragraphs). */
  variant?: 'flicker' | 'scramble'
  /** Leave undefined to play once on entering the viewport; pass a boolean to control it. */
  play?: boolean
  /** Flicker only: a second sentence shown in grey, animated with the rest. */
  muted?: string | null
  /**
   * Hide the text until it plays (default). Turn off for above-the-fold text such as the hero H1,
   * so it paints immediately (good for LCP) and flickers once JS arrives.
   */
  hideUntilPlayed?: boolean
  className?: string
  id?: string
}

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz'

/**
 * Text that animates in. It is real text in the HTML from the start: it's only hidden once JS has
 * loaded (the `js-ready` + `data-reveal` rule in globals.css), and never for reduced motion.
 * Flicker uses SplitText with `aria: 'auto'`, so screen readers get the whole text as a label
 * instead of single letters. Keyed by the text so a CMS edit remounts a clean element.
 */
export function SplitReveal({
  children,
  as = 'p',
  variant = 'flicker',
  play,
  muted,
  hideUntilPlayed = true,
  className,
  id,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const Element = as as ElementType

  useGSAP(
    () => {
      const el = ref.current
      if (!el || play === false) return
      ensureMotion()

      const reveal = () => {
        el.dataset.revealed = ''
        if (prefersReducedMotion()) return
        if (variant === 'scramble') {
          gsap.fromTo(
            el,
            { scrambleText: { text: '' } },
            {
              duration: Math.min(1.4, 0.4 + children.length * 0.006),
              ease: 'none',
              scrambleText: { text: children, chars: SCRAMBLE_CHARS, speed: 1 },
            },
          )
          return
        }
        const split = SplitText.create(el, { type: 'words,chars', aria: 'auto' })
        gsap.fromTo(
          split.chars,
          { opacity: 0 },
          {
            keyframes: { opacity: [0, 1, 0.2, 1] },
            duration: 0.3,
            ease: 'none',
            stagger: { each: 0.02, from: 'random' },
            onComplete: () => split.revert(),
          },
        )
      }

      if (play) {
        reveal()
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: reveal })
      }
    },
    { dependencies: [play, children, muted, variant], revertOnUpdate: true },
  )

  return (
    <Element
      key={`${children}|${muted ?? ''}`}
      ref={ref}
      id={id}
      className={className}
      data-reveal={hideUntilPlayed ? '' : undefined}
    >
      {children.split('\n').map((line, i, lines) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && (
            <>
              {' '}
              <br />
            </>
          )}
        </Fragment>
      ))}
      {muted && variant === 'flicker' && (
        <>
          {' '}
          <span className="text-text-muted">{muted}</span>
        </>
      )}
    </Element>
  )
}
