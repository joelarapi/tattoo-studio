import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/cn'

/*
 * Original line art in the style of tattoo stencils and flash sheets, from the approved design.
 * `data-stencil` makes PageMotion draw the lines in once they scroll into view; every shape gets
 * pathLength 1 and a small stagger.
 */

const delay = (index: number) =>
  ({ '--stroke-delay': `${Math.min(index * 35, 210)}ms` }) as CSSProperties

function Stencil({
  viewBox,
  className,
  shapes,
}: {
  viewBox: string
  className?: string
  shapes: ReactNode[]
}) {
  return (
    <svg
      data-stencil
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      fill="none"
      stroke="#ff6529"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('pointer-events-none', className)}
    >
      {shapes}
    </svg>
  )
}

const paths = (list: string[]) =>
  list.map((d, index) => <path key={d} d={d} pathLength={1} style={delay(index)} />)

/** Ornamental dagger and flourishes behind the hero images. */
export function HeroStencil({ className }: { className?: string }) {
  const shapes = paths([
    'M120 12v274M120 32l13 24-13 24-13-24 13-24ZM120 95l22 46-22 89-22-89 22-46Z',
    'm120 111 9 31-9 61-9-61 9-31ZM80 102c25 23 55 23 80 0M90 109c-2 16 13 23 30 23s32-7 30-23M120 246l9 13-9 18-9-18 9-13Z',
    'M105 70C65 43 37 72 55 94c13 16 39 6 28-8-7-9-20-2-14 7M135 70c40-27 68 2 50 24-13 16-39 6-28-8 7-9 20-2 14 7M96 159c-48-16-68 14-49 35 12 14 36 7 30-8-3-9-17-11-20-1M144 159c48-16 68 14 49 35-12 14-36 7-30-8 3-9 17-11 20-1',
    'M83 210c-30 16-32 41-17 52M157 210c30 16 32 41 17 52M82 231c-19-3-29 5-31 15 15 3 25-3 31-15ZM158 231c19-3 29 5 31 15-15 3-25-3-31-15ZM74 251c-16 1-23 12-20 22 15-2 22-10 20-22ZM166 251c16 1 23 12 20 22-15-2-22-10-20-22Z',
    'm30 124 5 8-5 8-5-8 5-8Zm180 0 5 8-5 8-5-8 5-8ZM120 4l3 5-3 5-3-5 3-5Z',
  ])
  shapes.push(
    <circle key="c1" cx="37" cy="213" r="2" pathLength={1} style={delay(5)} />,
    <circle key="c2" cx="203" cy="213" r="2" pathLength={1} style={delay(6)} />,
  )
  return <Stencil viewBox="0 0 240 300" className={className} shapes={shapes} />
}

/** A peony on a stem, behind the artist section. */
export function ArtistStencil({ className }: { className?: string }) {
  return (
    <Stencil
      viewBox="0 0 240 300"
      className={className}
      shapes={paths([
        'M120 285c-5-65 5-112 20-157M124 232c-20-26-32-45-55-62M127 208c21-22 43-33 65-39M133 167c-16-23-30-43-47-54',
        'M121 249c-30-3-46-20-46-40 28 4 44 18 46 40ZM127 223c29-1 47-17 49-38-29 2-47 16-49 38ZM101 201c-27 0-46-15-49-34 27 1 45 14 49 34ZM144 185c29 0 46-14 49-32-28 1-44 13-49 32ZM118 154c-27-5-40-22-38-41 26 7 39 20 38 41Z',
        'M140 126c-21-5-43-24-36-42-21-15-14-40 7-44 1-25 28-33 44-17 21-10 42 5 36 27 24 9 27 33 8 47 6 22-17 39-35 29-9 10-20 9-24 0Z',
        'M139 107c-17-4-24-19-16-30-10-14-1-28 14-27 8-16 27-12 31 2 17-1 25 16 14 28 5 15-9 28-24 23-7 11-16 10-19 4Z',
        'M142 90c-12-6-11-19-2-23 9-12 23-6 22 4 12 5 9 18-1 20-7 10-17 7-19-1ZM146 76c8-7 17 4 8 10M141 125l-15 15 19-8 13 10 6-16',
        'm46 122 4 6-4 6-4-6 4-6Zm158 105 4 6-4 6-4-6 4-6Z',
      ])}
    />
  )
}

const flash = {
  sketch: [
    'M20 18h39l17 17v44H20zM59 18v18h17M31 49c8-14 26-14 28-1 1 7-12 12-10 19M31 68c7-4 13-4 19-1M74 52l8-8 7 7-8 8-20 20-10 3 3-10 20-20ZM74 52l7 7M51 82l10-3',
    'm7 37 4 6-4 6-4-6 4-6ZM86 20v9M82 24h8',
  ],
  machine: [
    'm25 25 31-9 8 26-31 9zM32 24l6 21M41 21l6 21M50 18l6 21M20 51l46-13 7 9-49 15zM28 61l8 25 14-4-8-25M36 85l7 9M46 84l3 8M43 94l3-1M65 42l12-4 5 16-12 4M78 38l-6-18-12 4M20 51l-8 2-4-13 16-5M68 59l9 28M73 58l9 27M75 87l9-3M79 87l4 11',
    'M84 16v10M79 21h10M11 74l3 5-3 5-3-5 3-5Z',
  ],
  ink: [
    'M50 10C40 29 23 45 23 61a27 27 0 0 0 54 0C77 45 60 29 50 10ZM35 57c-5 10 0 20 10 22M50 29c4 9 10 15 14 23',
    'm15 20 5 8-5 8-5-8 5-8ZM85 67l5 8-5 8-5-8 5-8ZM72 10v10M67 15h10M16 88h19M65 93h19',
  ],
} as const

export type FlashIconName = keyof typeof flash

/** Small flash-sheet drawings for the planning cards: a sketch, a machine, an ink drop. */
export function FlashIcon({ name, className }: { name: FlashIconName; className?: string }) {
  return (
    <Stencil
      viewBox="0 0 100 108"
      className={cn('opacity-90', className)}
      shapes={paths([...flash[name]])}
    />
  )
}
