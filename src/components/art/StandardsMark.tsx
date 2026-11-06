import { circlePath, DashedBeam } from '@/components/motion/DashedBeam'

/* The mark in the middle of "Our standards": a needle and an ink drop inside a ring. */
export function StandardsMark() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="var(--color-line)"
      strokeWidth="1"
      className="size-full"
    >
      <circle cx="200" cy="200" r="170" />
      <circle cx="200" cy="200" r="120" strokeDasharray="3 6" />
      <path d="M200 20v40M200 340v40M20 200h40M340 200h40" />
      <path d="m80 80 28 28M320 80l-28 28M80 320l28-28M320 320l-28-28" />
      {/* needle */}
      <path d="M200 92v150" stroke="var(--color-text-faint)" />
      <path d="M194 92h12v44h-12z" stroke="var(--color-text-faint)" />
      {/* ink drop */}
      <path d="M200 262s22 25 22 41a22 22 0 0 1-44 0c0-16 22-41 22-41Z" />
      <g data-no-draw="">
        <DashedBeam d={circlePath(200, 200, 170)} length={6} duration={10} />
        <rect x="196" y="242" width="8" height="8" fill="var(--color-accent)" stroke="none" />
      </g>
    </svg>
  )
}
