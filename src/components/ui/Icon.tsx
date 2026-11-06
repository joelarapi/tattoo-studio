import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

/* Line icons for the names editors pick in the CMS (src/lib/icons.ts). 24×24, 1.5px strokes. */
const paths: Record<IconName, ReactNode> = {
  'fine-line': (
    <>
      <path d="M3 19c5-1 7-5 9-9s5-6 9-6" />
      <path d="M12.5 10c-2.2.2-3.8-1-4-3.2 2.2-.2 3.8 1 4 3.2Z" />
    </>
  ),
  blackwork: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 20 20 4v16Z" fill="currentColor" />
    </>
  ),
  realism: (
    <>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  traditional: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
  ),
  lettering: <path d="m4.5 18 5-12 5 12M6.6 13h5.8M16 18h4" />,
  'cover-up': (
    <>
      <rect x="4" y="8" width="12" height="12" />
      <path d="M8 8V4h12v12h-4" />
    </>
  ),
  geometric: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 19.8 16.5H4.2Z" />
    </>
  ),
  dotwork: (
    <g fill="currentColor" stroke="none">
      {[6, 12, 18].flatMap((y) =>
        [6, 12, 18].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 12 && y === 12 ? 2 : 1.2} />
        )),
      )}
    </g>
  ),
  needle: (
    <>
      <path d="m3 21 10-10" />
      <path d="m13 11 1.5-1.5 2 2L15 13Z" />
      <path d="m14.5 9.5 5-5 2 2-5 5" />
    </>
  ),
  ink: <path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z" />,
  certificate: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m9 13.8-1 7.2 4-2 4 2-1-7.2" />
    </>
  ),
  aftercare: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 19 6v5c0 5-3 8.2-7 10-4-1.8-7-5-7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 5 2 7-2 7-2-7Z" />
    </>
  ),
}

export function Icon({
  name,
  className,
}: {
  name: IconName | null | undefined
  className?: string
}) {
  if (!name || !(name in paths)) return null
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={cn('size-6 shrink-0', className)}
    >
      {paths[name]}
    </svg>
  )
}
