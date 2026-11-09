'use client'

import { type ReactNode, useState } from 'react'

import { cn } from '@/lib/cn'

type Card = { id: number; category?: string | null; node: ReactNode }

/**
 * The portfolio filter: one button per category (from the CMS), a running count and the grid.
 * The cards are rendered on the server; this only chooses which to show. Without JS every piece
 * is shown and the buttons do nothing.
 */
export function PortfolioGrid({
  cards,
  categories,
  allLabel,
  countLabel,
}: {
  cards: Card[]
  categories: { slug: string; name: string }[]
  allLabel: string
  countLabel?: string | null
}) {
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? cards.filter((card) => card.category === active) : cards
  const used = categories.filter((category) =>
    cards.some((card) => card.category === category.slug),
  )

  const filters = [
    { slug: null, name: allLabel },
    ...used.map(({ slug, name }) => ({ slug, name })),
  ]

  return (
    <>
      <div className="mb-8 md:flex md:items-center md:justify-between md:gap-5">
        <div
          role="group"
          aria-label="Filter the portfolio"
          className="mb-[15px] flex flex-wrap gap-[7px] md:mb-0 md:gap-2"
        >
          {filters.map((filter) => {
            const pressed = active === filter.slug
            return (
              <button
                key={filter.slug ?? 'all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(filter.slug)}
                className={cn(
                  'cursor-pointer rounded-sm border px-3 py-2.5 font-label text-[9px] uppercase transition-colors md:px-[15px] md:py-[11px] md:text-[10px]',
                  pressed
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-line bg-panel-2 text-[#aaa] hover:text-text',
                )}
              >
                {filter.name}
              </button>
            )
          })}
        </div>
        <span
          aria-live="polite"
          className="font-label text-[9px] whitespace-nowrap text-faint uppercase"
        >
          {String(shown.length).padStart(2, '0')}
          {countLabel && ` / ${countLabel}`}
        </span>
      </div>
      <div className="grid grid-cols-1 items-start gap-x-[22px] gap-y-10 md:grid-cols-3 md:gap-y-[42px]">
        {shown.map((card) => (
          <div key={card.id} className="min-w-0">
            {card.node}
          </div>
        ))}
      </div>
    </>
  )
}
