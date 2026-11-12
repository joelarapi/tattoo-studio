import { cn } from '@/lib/cn'

/*
 * Small symbols drawn as SVG rather than typed: iOS renders characters like ✳ and ▶ as colour
 * emoji, and decorative glyphs fall back to random fonts.
 */

type GlyphProps = { className?: string }

/** The studio's eight-spoked asterisk. */
export function Asterisk({ className }: GlyphProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn('inline-block size-[1em] text-accent', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  )
}

export function PlayIcon({ className }: GlyphProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />
    </svg>
  )
}

/** The large symbols on the "Hotels and transport" cards. */
export function SupportSymbol({ name, className }: GlyphProps & { name: 'home' | 'arrow' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 64"
      className={cn('text-accent', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {name === 'home' ? (
        <path d="M10 30 32 10l22 20M16 25v29h32V25M27 54V38h10v16" />
      ) : (
        <path d="M14 50 50 14M24 14h26v26" />
      )}
    </svg>
  )
}

/** Graphic motifs for the destination cards on Visiting Albania (not maps, not photos). */
export function DestinationMotif({
  motif,
  className,
}: GlyphProps & { motif: 'columns' | 'windows' | 'waves' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 160 120"
      className={className}
      fill="none"
      strokeLinecap="round"
    >
      {motif === 'columns' && (
        <g strokeWidth="4" transform="skewY(-4) translate(0 6)">
          <path d="M30 28h100" stroke="var(--color-accent)" />
          <path d="M30 96h100" stroke="var(--color-accent)" opacity="0.6" />
          <path d="M44 36v52M68 36v52M92 36v52M116 36v52" stroke="#f6f5f2" strokeWidth="6" />
        </g>
      )}
      {motif === 'windows' && (
        <g stroke="#f6f5f2" strokeWidth="2.5" transform="skewY(-8) translate(0 12)">
          <rect x="68" y="20" width="24" height="16" />
          <rect x="52" y="48" width="24" height="16" />
          <rect x="84" y="48" width="24" height="16" />
          <rect x="36" y="76" width="24" height="16" stroke="var(--color-accent)" />
          <rect x="68" y="76" width="24" height="16" />
          <rect x="100" y="76" width="24" height="16" />
        </g>
      )}
      {motif === 'waves' && (
        <g strokeWidth="3" transform="rotate(-8 80 60)">
          <path d="M30 40c10-8 20-8 30 0s20 8 30 0 20-8 30 0" stroke="#f6f5f2" />
          <path d="M30 62c10-8 20-8 30 0s20 8 30 0 20-8 30 0" stroke="var(--color-accent)" />
          <path d="M30 84c10-8 20-8 30 0s20 8 30 0 20-8 30 0" stroke="#f6f5f2" opacity="0.6" />
        </g>
      )}
    </svg>
  )
}
