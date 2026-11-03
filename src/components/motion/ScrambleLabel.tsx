'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useRef } from 'react'

import { ensureMotion, prefersReducedMotion } from '@/lib/motion/gsap'

gsap.registerPlugin(useGSAP, ScrambleTextPlugin)

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+'

/**
 * A label that scrambles when the mouse enters its closest link or button. It only runs for
 * mouse pointers (never on focus), so the accessible name is never read mid-scramble. Roboto
 * Mono is monospaced, so the label width doesn't jump.
 */
export function ScrambleLabel({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current
      const host = el?.closest<HTMLElement>('a, button')
      if (!el || !host || !contextSafe) return

      ensureMotion()

      const play = contextSafe((event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || prefersReducedMotion()) return
        gsap.to(el, {
          duration: 0.6,
          overwrite: true,
          scrambleText: { text, chars: CHARS, speed: 0.8 },
        })
      })

      host.addEventListener('pointerenter', play)
      return () => host.removeEventListener('pointerenter', play)
    },
    { dependencies: [text], scope: ref },
  )

  return <span ref={ref}>{text}</span>
}
