import { cn } from '@/lib/cn'

const DOTS = 24
const PITCH = 8
const DOT = 3
const HEIGHT = 16
const PAD = 10

const WIDTH = PAD * 2 + (DOTS - 1) * PITCH + DOT

/** Dot colours by distance from the current position: accent, then fading greys. */
const NEAR = [
  'var(--color-accent)',
  'var(--color-text-muted)',
  'var(--color-text-faint)',
  'var(--color-muted)',
]
const PASSED = 'var(--color-line)'
const AHEAD = 'var(--color-surface-2)'

/**
 * Pill-shaped track of small square dots plus a "01 / 04" step counter. Purely visual (the steps
 * themselves are readable text), so it's hidden from screen readers. Painted by `paintProgress`
 * from the scroll handler rather than through React state, so scrolling never re-renders.
 */
export function ProgressIndicator({ steps, className }: { steps: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-progress=""
      className={cn(
        'items-center gap-3 mono-label-sm whitespace-nowrap text-text-faint',
        className,
      )}
    >
      <span className="tabular-nums">
        <span data-progress-step className="text-text">
          01
        </span>{' '}
        / {String(steps).padStart(2, '0')}
      </span>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block">
        <rect
          x="0.5"
          y="0.5"
          width={WIDTH - 1}
          height={HEIGHT - 1}
          rx={(HEIGHT - 1) / 2}
          fill="var(--color-surface)"
          stroke="var(--color-line)"
        />
        {Array.from({ length: DOTS }, (_, i) => (
          <rect
            key={i}
            data-dot=""
            x={PAD + i * PITCH}
            y={(HEIGHT - DOT) / 2}
            width={DOT}
            height={DOT}
            style={{ fill: AHEAD }}
          />
        ))}
      </svg>
    </div>
  )
}

/** Lights the dots around `progress` (0–1) and shows the active step number. */
export function paintProgress(root: HTMLElement, progress: number, step: number) {
  const position = progress * (DOTS - 1)
  root.querySelectorAll<SVGRectElement>('[data-dot]').forEach((dot, i) => {
    const distance = Math.abs(i - position)
    const level = Math.floor(distance + 0.25)
    const fill = level < NEAR.length ? NEAR[level] : i < position ? PASSED : AHEAD
    if (dot.style.fill !== fill) dot.style.fill = fill
  })
  const label = root.querySelector('[data-progress-step]')
  const text = String(step + 1).padStart(2, '0')
  if (label && label.textContent !== text) label.textContent = text
}
