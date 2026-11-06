/*
 * Hero background: a drafting sheet with a compass rose, a coil tattoo machine, a pen machine and
 * a compass-drawn rosette (the kind of construction lines used for geometric stencils).
 * Original artwork; thin --color-line strokes. Drawn in by <LineArt>.
 */

const CX = 720
const CY = 470

function ticks(r: number, count: number, long: number, short: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const length = i % 6 === 0 ? long : short
    const x1 = CX + Math.cos(angle) * r
    const y1 = CY + Math.sin(angle) * r
    const x2 = CX + Math.cos(angle) * (r - length)
    const y2 = CY + Math.sin(angle) * (r - length)
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`
  }).join('')
}

function arc(r: number, from: number, to: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const x1 = CX + Math.cos(rad(from)) * r
  const y1 = CY + Math.sin(rad(from)) * r
  const x2 = CX + Math.cos(rad(to)) * r
  const y2 = CY + Math.sin(rad(to)) * r
  const large = to - from > 180 ? 1 : 0
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

/** Six circles around a seventh: the classic compass rosette. */
function Rosette({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={(x + Math.cos(angle) * r).toFixed(1)}
            cy={(y + Math.sin(angle) * r).toFixed(1)}
            r={r}
          />
        )
      })}
      <circle cx={x} cy={y} r={r * 2} strokeDasharray="3 7" />
    </g>
  )
}

function CoilMachine() {
  return (
    <g transform="translate(70 520)">
      {/* frame */}
      <path d="M24 150V44q0-22 22-22h104" />
      <path d="M24 150h150" />
      {/* coils with windings */}
      <rect x="58" y="62" width="38" height="88" rx="6" />
      <rect x="112" y="62" width="38" height="88" rx="6" />
      <path d="M58 80h38M58 96h38M58 112h38M58 128h38M112 80h38M112 96h38M112 112h38M112 128h38" />
      {/* armature bar, springs, contact screw */}
      <rect x="52" y="46" width="150" height="10" />
      <path d="M150 46q10-14 26-10" />
      <path d="M202 8v38" />
      <circle cx="202" cy="6" r="5" />
      {/* tube vise, tube, grip and needle */}
      <rect x="180" y="150" width="34" height="22" />
      <rect x="189" y="172" width="16" height="120" />
      <path d="M187 214h20M187 222h20M187 230h20M187 238h20M187 246h20M187 254h20" />
      <path d="M197 292v34" />
      <path d="M197 56v94" strokeDasharray="2 4" />
    </g>
  )
}

function PenMachine() {
  return (
    <g transform="translate(1210 90) rotate(32)">
      <path d="M23 0C23-60 80-90 140-70" />
      <rect x="0" y="0" width="46" height="250" rx="23" />
      <path d="M0 60h46M0 66h46" />
      <path d="M2 168h42M2 178h42M2 188h42M2 198h42M2 208h42M2 218h42" />
      <path d="M8 250 23 292 38 250" />
      <path d="M23 292v34" />
    </g>
  )
}

export function HeroArt() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--color-line)"
      strokeWidth="1"
      className="size-full"
    >
      {/* compass rose behind the headline */}
      <circle cx={CX} cy={CY} r="380" />
      <circle cx={CX} cy={CY} r="300" stroke="var(--color-surface-2)" />
      <circle cx={CX} cy={CY} r="210" stroke="var(--color-surface-2)" />
      <path d={ticks(380, 72, 18, 7)} />
      <path d={arc(430, -150, 40)} strokeDasharray="4 6" />
      <path d={`M${CX} 40V900M260 ${CY}H1180`} stroke="var(--color-surface-2)" />
      {/* drafting compass standing on the rose */}
      <circle cx={CX} cy="58" r="9" />
      <path d={`M${CX - 4} 66 ${CX - 168} ${CY + 330}M${CX + 4} 66 ${CX + 168} ${CY + 330}`} />
      <path d={`M${CX - 70} 250h140`} />

      <Rosette x={250} y={230} r={56} />
      <CoilMachine />
      <PenMachine />

      {/* registration marks */}
      <path d="M1290 760h28M1304 746v28M150 96h28M164 82v28" />

      <g data-no-draw="" fill="var(--color-accent)" stroke="none">
        <rect x={CX - 172} y={CY + 326} width="8" height="8" />
        <rect x={CX + 164} y={CY + 326} width="8" height="8" />
      </g>
    </svg>
  )
}
