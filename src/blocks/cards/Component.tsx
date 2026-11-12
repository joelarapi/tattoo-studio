import type { ReactNode } from 'react'

import { Asterisk, DestinationMotif, SupportSymbol } from '@/components/art/Glyphs'
import { FlashIcon } from '@/components/art/Stencils'
import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { Notice, NumberedCards, SectionHead } from '@/components/ui/Blocks'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { cn } from '@/lib/cn'
import type { CardsBlock } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

type Card = NonNullable<CardsBlock['cards']>[number]
type Graphic = NonNullable<Card['graphic']>

const flashIcons = new Set<Graphic>(['sketch', 'machine', 'ink'])

/** The small graphics above a numbered card's title, from the design. */
function graphic(name: Card['graphic']): ReactNode {
  if (!name) return null
  if (name === 'sketch' || name === 'machine' || name === 'ink') {
    return (
      <FlashIcon
        name={name}
        className="mt-[22px] block h-[82px] w-[76px] md:mt-[25px] md:h-[91px] md:w-[84px]"
      />
    )
  }
  const frame = 'flex h-[150px] items-center justify-center md:h-[180px]'
  if (name === 'circles') {
    return (
      <div aria-hidden="true" className={cn(frame, 'gap-2')}>
        <i className="size-[55px] rounded-full bg-linear-[130deg] from-accent-hover to-accent shadow-[4px_4px_0] shadow-accent/35 md:size-[35px] lg:size-12" />
        <i className="size-[55px] rounded-full bg-linear-90 from-accent from-50% to-[#282828] to-50% shadow-[4px_4px_0] shadow-accent/35 md:size-[35px] lg:size-12" />
        <i className="size-[55px] rounded-full bg-[#292929] shadow-[4px_4px_0_#191919] md:size-[35px] lg:size-12" />
      </div>
    )
  }
  if (name === 'bars') {
    return (
      <div aria-hidden="true" className={frame}>
        <span className="-skew-y-8 bg-linear-90 from-accent via-accent/40 via-65% to-[#333] bg-clip-text text-[100px] font-bold tracking-[-8px] text-transparent">
          ||||||||
        </span>
      </div>
    )
  }
  return (
    <div aria-hidden="true" className={frame}>
      <Asterisk className="text-[110px] drop-shadow-[4px_3px_0] drop-shadow-accent/45" />
    </div>
  )
}

const gridColumns = (columns: string | null | undefined) =>
  columns === '2' ? 'md:grid-cols-2' : 'md:grid-cols-3'

function PanelCards({ cards, columns }: { cards: Card[]; columns: string }) {
  return (
    <div data-reveal-group className={cn('grid grid-cols-1 gap-6', gridColumns(columns))}>
      {cards.map((card, index) => (
        <article
          key={card.id}
          data-reveal
          className="rounded-[5px] border border-[#2b2b2b] bg-[#141414] p-[27px] md:p-[35px]"
        >
          <span className="font-label text-[14px] text-accent uppercase">
            {String(index + 1).padStart(2, '0')}
            {card.label && ` / ${card.label}`}
          </span>
          <h3 className="mt-7 text-[28px] leading-[1.2] tracking-[-1px] md:text-[30px]">
            <Lines text={card.title} />
          </h3>
          <Paragraphs text={card.text} className="mt-[23px] text-[16px] leading-[1.9]" />
          <Action link={card.link} variant="text" className="mt-[25px]" />
        </article>
      ))}
    </div>
  )
}

function FeatureCards({ cards, columns }: { cards: Card[]; columns: string }) {
  return (
    <div data-reveal-group className={cn('grid grid-cols-1 gap-5', gridColumns(columns))}>
      {cards.map((card) => (
        <article
          key={card.id}
          data-reveal
          className="rounded-md border border-line bg-panel-2 p-[25px] lg:p-[35px]"
        >
          <SupportSymbol name={card.symbol ?? 'home'} className="mt-[5px] mb-[30px] size-[52px]" />
          <Tag className="mb-3">{card.tag}</Tag>
          <h3 className="text-[28px] leading-[1.2] tracking-[-1px] lg:text-[32px]">
            <Lines text={card.title} />
          </h3>
          <Paragraphs text={card.text} className="mt-[23px] text-[16px]" />
          {card.checklist && (
            <ul className="mt-5 mb-[25px] list-disc pl-[18px] text-[14px] leading-[2] text-[#aaa]">
              {card.checklist
                .split('\n')
                .filter((line) => line.trim())
                .map((line) => (
                  <li key={line}>{line.trim()}</li>
                ))}
            </ul>
          )}
          <Action link={card.link} variant="outline" className="text-[14px]" />
        </article>
      ))}
    </div>
  )
}

function PlaceCards({ cards, columns }: { cards: Card[]; columns: string }) {
  return (
    <div data-reveal-group className={cn('grid grid-cols-1 gap-5', gridColumns(columns))}>
      {cards.map((card) => (
        <article
          key={card.id}
          data-reveal
          className="rounded-[5px] border border-line bg-panel px-[18px] pt-[18px] pb-[30px] lg:px-[25px] lg:pt-5"
        >
          <div className="mb-[25px] grid h-[180px] place-items-center overflow-hidden bg-[linear-gradient(#ffffff05_1px,transparent_1px),linear-gradient(90deg,#ffffff05_1px,transparent_1px)] bg-size-[30px_30px] lg:h-[220px]">
            <DestinationMotif motif={card.motif ?? 'columns'} className="h-[120px] w-[160px]" />
          </div>
          <Tag className="mb-3 text-[14px] md:text-[14px]">{card.tag}</Tag>
          <h3 className="text-[36px] leading-[1.15] tracking-[-1.2px]">
            <Lines text={card.title} />
          </h3>
          <Paragraphs text={card.text} className="mt-[15px] text-[16px] leading-[1.85]" />
          <Action link={card.link} variant="text" className="mt-[25px] text-[14px]" />
        </article>
      ))}
    </div>
  )
}

/** A heading, then cards in one of four styles, then optional notes. */
export function Cards({ block, ctx }: BlockProps<'cards'>) {
  const cards = block.cards ?? []
  const columns = block.columns ?? '3'
  const { note, closingNote } = block
  return (
    <BlockSection block={block} className="px-site py-section">
      <SectionHead
        tag={block.tag}
        number={ctx.number}
        heading={block.heading}
        intro={block.intro}
        size={block.headingSize ?? 'md'}
        as={ctx.headingAs}
      />

      {block.style === 'panel' ? (
        <PanelCards cards={cards} columns={columns} />
      ) : block.style === 'feature' ? (
        <FeatureCards cards={cards} columns={columns} />
      ) : block.style === 'place' ? (
        <PlaceCards cards={cards} columns={columns} />
      ) : (
        <NumberedCards
          cards={cards}
          columns={columns === '2' ? 2 : 3}
          visual={(index) => graphic(cards[index]?.graphic)}
          titleClassName={(index) => {
            const name = cards[index]?.graphic
            return name && flashIcons.has(name) ? 'mt-5 md:mt-5' : undefined
          }}
        />
      )}

      {(note?.title || note?.text) && (
        <div
          data-reveal
          className="mt-[25px] flex flex-wrap items-center gap-[15px] border border-line-strong p-[22px] md:flex-nowrap md:gap-[22px] md:p-6"
        >
          <Asterisk className="text-[28px]" />
          <p className="flex-1 basis-[80%] text-[16px] leading-[1.8] md:basis-auto md:text-[16px]">
            {note.title && <b className="font-normal text-[#ddd]">{note.title} </b>}
            {note.text}
          </p>
          <Action
            link={note.link}
            variant="plain"
            className="ml-[43px] whitespace-nowrap md:ml-0"
          />
        </div>
      )}

      {block.notice && (
        <Notice className="my-[25px]">
          <Lines text={block.notice} />
        </Notice>
      )}

      <Paragraphs
        text={block.smallPrint}
        className="mt-[23px] text-[16px] leading-[1.85] text-[#969696]"
      />

      {closingNote?.title &&
        (closingNote.tag ? (
          <div
            data-reveal
            className="mt-[45px] grid grid-cols-1 gap-x-[8%] gap-y-5 border-t border-line-strong pt-[35px] md:grid-cols-[1fr_1.5fr]"
          >
            <Tag className="m-0 md:col-span-2">{closingNote.tag}</Tag>
            <h3 className="text-[30px] leading-[1.2] tracking-[-1px]">
              <Lines text={closingNote.title} />
            </h3>
            <RichText
              data={closingNote.text}
              className={cn(closingLinks, 'text-[16px] leading-[1.85]')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 border-t border-line-strong pt-[25px] md:grid-cols-[1fr_2fr] md:gap-[8%]">
            <h3 className="text-h3">
              <Lines text={closingNote.title} />
            </h3>
            <RichText
              data={closingNote.text}
              className={cn(closingLinks, 'text-[16px] leading-[1.9]')}
            />
          </div>
        ))}
    </BlockSection>
  )
}

const closingLinks =
  '[&_a]:text-text [&_a]:underline [&_a]:underline-offset-[3px] [&_p+p]:mt-[18px]'
