import { circlePath, DashedBeam } from '@/components/motion/DashedBeam'

const CX = 600
const CY = 400
const RINGS = [130, 210, 290, 370]

/* Concentric drafting circles with dashed beams of light travelling around them. */
export function StatementArt() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--color-line)"
      strokeWidth="1"
      className="size-full"
    >
      {RINGS.map((r, i) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          stroke={i % 2 ? 'var(--color-surface-2)' : 'var(--color-line)'}
        />
      ))}
      <circle cx={CX} cy={CY} r="450" strokeDasharray="2 8" />
      <path d={`M${CX} 0V800M80 ${CY}H1120`} stroke="var(--color-surface-2)" />
      <path
        d={`M${CX - 370} ${CY - 370}L${CX + 370} ${CY + 370}`}
        stroke="var(--color-surface-2)"
      />
      <g data-no-draw="">
        <DashedBeam d={circlePath(CX, CY, 210)} length={5} duration={9} />
        <DashedBeam d={circlePath(CX, CY, 370)} length={3} duration={14} reverse delay={4} />
        <DashedBeam d={circlePath(CX, CY, 450)} length={2} duration={20} delay={9} />
      </g>
    </svg>
  )
}
