import Link from 'next/link'

import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { getPortfolioItems } from '@/lib/data'
import { pathForDoc } from '@/lib/routes'
import type { PortfolioItem } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import { populated } from '../populated'
import type { BlockContext, BlockOf, BlockProps } from '../types'

/**
 * The chosen pieces; on a piece's own page, by default, the pieces one, three and six places on
 * (wrapping round to the start); elsewhere the first three.
 */
export async function loadPieceSuggestions(
  block: BlockOf<'pieceSuggestions'>,
  ctx: Partial<BlockContext>,
): Promise<PortfolioItem[] | null> {
  const chosen = populated(block.pieces).filter((item) => item.id !== ctx.piece?.item.id)
  if (chosen.length) return chosen
  if (ctx.piece) {
    const { item, items } = ctx.piece
    const position = items.findIndex((other) => other.id === item.id)
    const picks = [...new Set([1, 3, 6].map((offset) => items[(position + offset) % items.length]))]
    const suggestions = picks.filter((other) => other && other.id !== item.id).slice(0, 3)
    return suggestions.length ? suggestions : null
  }
  const items = (await getPortfolioItems()).slice(0, 3)
  return items.length ? items : null
}

/** Three more pieces as cards, with a link to the whole portfolio. */
export function PieceSuggestions({
  block,
  data: pieces,
  ctx,
}: BlockProps<'pieceSuggestions', PortfolioItem[]>) {
  return (
    <BlockSection block={block} className="px-site py-section">
      <div data-reveal className="mb-[35px] md:flex md:items-end md:justify-between md:gap-[30px]">
        <div>
          <Tag number={ctx.number}>{block.tag}</Tag>
          <StyledHeading
            as={ctx.headingAs}
            value={block.heading}
            className="text-[36px] leading-[1.13] tracking-[-1.5px] md:text-[45px] md:tracking-[-2px]"
          />
        </div>
        <Action link={block.button} variant="outline" className="mt-[25px] md:mt-0" />
      </div>
      <div data-reveal-group className="grid grid-cols-1 gap-[35px] md:grid-cols-3 md:gap-6">
        {pieces.map((other) => (
          <Link
            key={other.id}
            href={pathForDoc('portfolio-items', other.slug)}
            data-reveal
            className="group block"
          >
            <div className="relative h-[390px] overflow-hidden rounded-[5px] border border-line-strong bg-panel-2 md:h-[340px]">
              <CmsImage
                media={other.images?.[0] ?? other.videoPoster}
                fill
                sizes="(min-width: 681px) 33vw, 90vw"
                className="object-cover transition-transform duration-400 group-hover:scale-[1.035] motion-reduce:transition-none"
              />
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 border border-[#777] bg-[#111b] px-3 py-[3px] text-[22px] text-text"
              >
                ↗&#xFE0E;
              </span>
            </div>
            <h3 className="mt-5 text-[25px] leading-[1.25] md:text-[21px] lg:text-[24px]">
              {other.title}
            </h3>
            {block.cardLink && <span className="mt-3.5 link-text">{block.cardLink} ↗&#xFE0E;</span>}
          </Link>
        ))}
      </div>
    </BlockSection>
  )
}
