import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { FilmCard } from '@/components/home/FilmCard'
import { Action } from '@/components/ui/Action'
import { SectionHead } from '@/components/ui/Blocks'
import { ScrollTrack } from '@/components/ui/ScrollTrack'
import { cn } from '@/lib/cn'
import { getPortfolioItems } from '@/lib/data'
import type { PortfolioItem } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import { populated } from '../populated'
import type { BlockOf, BlockProps } from '../types'

type Data = { pieces: PortfolioItem[]; films: PortfolioItem[] }

/** The chosen pieces (or the start of the portfolio), and the chosen pieces that have a film. */
export async function loadWorkShowcase(block: BlockOf<'workShowcase'>): Promise<Data | null> {
  const chosen = populated(block.pieces)
  const pieces = chosen.length ? chosen : (await getPortfolioItems()).slice(0, 9)
  const films = populated(block.films?.pieces).filter((item) => item.video && item.videoPoster)
  return pieces.length || films.length ? { pieces, films } : null
}

/** The tiny credit line above the photos and under the films. */
function CreditLine({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return (
    <p
      className={cn(
        'max-w-[900px] font-label text-[16px] leading-[1.9] text-faint uppercase md:text-[16px] md:leading-[1.8]',
        className,
      )}
    >
      {text}
    </p>
  )
}

/** Portfolio photos in a sideways gallery, then a gallery of films. */
export function WorkShowcase({ block, data, ctx }: BlockProps<'workShowcase', Data>) {
  const { pieces, films } = data
  return (
    <BlockSection block={block} className="px-site py-section">
      <SectionHead
        tag={block.tag}
        number={ctx.number}
        heading={block.heading}
        intro={block.intro}
        as={ctx.headingAs}
        action={<Action link={block.button} variant="outline" />}
      />
      <CreditLine text={block.creditLine} className="mb-[25px]" />
      {pieces.length > 0 && (
        <ScrollTrack
          label={block.trackLabel}
          ariaLabel="Tattoo photography"
          colourCycle={block.colourCycle ?? true}
        >
          {pieces.map((item, index) => (
            <PortfolioCard
              key={item.id}
              item={item}
              position={index + 1}
              imageClassName="h-[390px] md:h-[310px] lg:h-[400px] 2xl:h-[400px]"
            />
          ))}
        </ScrollTrack>
      )}
      {films.length > 0 && (
        <ScrollTrack label={block.films?.trackLabel} ariaLabel="Tattoo films">
          {films.map((item) => (
            <FilmCard
              key={item.id}
              item={item}
              label={block.films?.itemLabel}
              watchLabel={block.films?.watchLabel}
            />
          ))}
        </ScrollTrack>
      )}
      <CreditLine text={block.creditLine} />
    </BlockSection>
  )
}
