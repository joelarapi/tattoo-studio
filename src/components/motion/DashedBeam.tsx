import type { CSSProperties } from 'react'

type DashedBeamProps = {
  /** SVG path the beam travels along (see `circlePath`). */
  d: string
  /** Beam length as a share of the path, 1–50. */
  length?: number
  /** Seconds per lap. */
  duration?: number
  reverse?: boolean
  delay?: number
}

/**
 * A short accent dash that travels along a path, like light moving along a drafting line. Use
 * inside an <svg>. Pure CSS (`.beam` in globals.css), so it needs no JS and stops for reduced
 * motion.
 */
export function DashedBeam({ d, length = 4, duration = 8, reverse, delay = 0 }: DashedBeamProps) {
  return (
    <path
      d={d}
      pathLength={100}
      className="beam"
      strokeDasharray={`${length} ${100 - length}`}
      style={
        {
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationDelay: `${-delay}s`,
        } as CSSProperties
      }
    />
  )
}

/** A circle as a path starting at the top, clockwise. */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}`
}
