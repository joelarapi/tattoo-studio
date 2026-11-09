import type { ReactNode } from 'react'

import { Asterisk } from '@/components/art/Glyphs'
import { cn } from '@/lib/cn'
import type { HeadingValue } from '@/lib/heading'
import type { Media } from '@/payload-types'

import { Action } from './Action'
import { CmsImage } from './CmsImage'
import { StyledHeading } from './StyledHeading'
import { Tag } from './Tag'
import { Lines, Paragraphs } from './Text'

type CmsLink = { label?: string | null; href?: string | null } | null | undefined

/** A short orange "needle" between sections. */
export function NeedleDivider() {
  return (
    <div
      aria-hidden="true"
      data-reveal
      className="mx-auto flex h-[15px] max-w-[1400px] items-center px-site md:h-5"
    >
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#5d3b2b]" />
      <i className="relative mx-3 h-px w-[45px] bg-[#a65531] md:mx-[18px] md:w-[70px]">
        <span className="absolute -top-1 left-[17px] size-[7px] rotate-45 border border-accent bg-[#080808] md:left-7" />
        <span className="absolute -top-0.5 -right-[9px] size-0 border-y-2 border-l-[9px] border-y-transparent border-l-accent" />
      </i>
      <span className="h-px flex-1 bg-linear-to-r from-[#5d3b2b] to-transparent" />
    </div>
  )
}

/** A boxed note with the asterisk. */
export function Notice({ children, className }: { children: ReactNode; className?: string }) {
  if (!children) return null
  return (
    <div
      className={cn(
        'flex gap-3 rounded-[5px] border border-[#303030] p-[15px] md:gap-[15px] md:px-[22px] md:py-[18px]',
        className,
      )}
    >
      <Asterisk className="mt-1 shrink-0 text-[20px]" />
      <div className="max-w-[850px] text-[11px] leading-[1.7]">{children}</div>
    </div>
  )
}

/**
 * A section heading row: label and heading on the left; intro and an optional button on the
 * right, bottom-aligned.
 */
export function SectionHead({
  tag,
  number,
  heading,
  intro,
  action,
  size = 'lg',
  as = 'h2',
  className,
}: {
  tag?: string | null
  number?: number
  heading: HeadingValue
  intro?: string | null
  action?: ReactNode
  size?: 'lg' | 'md' | 'sm'
  as?: 'h1' | 'h2'
  className?: string
}) {
  const headingClass = { lg: 'text-h2-lg', md: 'text-h2', sm: 'text-h2-sm' }[size]
  return (
    <div
      data-reveal
      className={cn(
        'mb-[30px] md:mb-10 md:flex md:items-end md:justify-between md:gap-10',
        className,
      )}
    >
      <div>
        <Tag number={number}>{tag}</Tag>
        <StyledHeading as={as} value={heading} className={headingClass} />
      </div>
      {(intro || action) && (
        <div className="mt-6 md:mt-0 md:shrink-0">
          {intro && (
            <p className="text-[13px]">
              <Lines text={intro} />
            </p>
          )}
          {action && <div className={cn(intro && 'mt-[22px]')}>{action}</div>}
        </div>
      )}
    </div>
  )
}

/**
 * A photo behind the top of a page, in colour under a dark wash and the grid. Goes inside a
 * `grid-bg` section, which keeps its circle and vignette on top.
 */
export function HeroPhoto({ media }: { media: Media | number | null | undefined }) {
  if (!media || typeof media !== 'object') return null
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-2">
      <CmsImage
        media={media}
        alt=""
        fill
        sizes="100vw"
        photo={false}
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />
      <div className="absolute inset-0 hero-photo" />
    </div>
  )
}

/** The closing call to action at the end of a page. */
export function EndCta({
  cta,
  as = 'h2',
  className,
}: {
  cta:
    | {
        tag?: string | null
        heading: HeadingValue
        text?: string | null
        button?: CmsLink
        note?: string | null
      }
    | null
    | undefined
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  if (!cta?.heading?.text) return null
  return (
    <section
      data-block="pageCta"
      className={cn(
        'grid-bg overflow-hidden border-t border-line px-[6%] py-[70px] text-center md:py-[100px]',
        className,
      )}
    >
      <div data-reveal>
        <Tag className="mb-5">{cta.tag}</Tag>
        <StyledHeading as={as} value={cta.heading} className="text-cta" />
      </div>
      <Paragraphs text={cta.text} className="mx-auto mt-[23px] max-w-[640px] text-[14px]" />
      <div data-reveal className="mt-[30px]">
        <Action link={cta.button} />
      </div>
      {cta.note && (
        <p className="mt-[23px] text-[10px] md:text-[11px]">
          <Lines text={cta.note} />
        </p>
      )}
    </section>
  )
}

type Card = {
  id?: string | null
  label?: string | null
  title: string
  text?: string | null
  link?: CmsLink
}

/** Numbered cards ("01 / Your idea"), three to a row. `visual` adds a graphic above each title. */
export function NumberedCards({
  cards,
  visual,
  columns = 3,
  className,
  titleClassName,
}: {
  cards: Card[] | null | undefined
  visual?: (index: number) => ReactNode
  columns?: 2 | 3
  className?: string
  titleClassName?: string | ((index: number) => string | undefined)
}) {
  if (!cards?.length) return null
  return (
    <div
      data-reveal-group
      className={cn(
        'grid grid-cols-1 gap-3',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        className,
      )}
    >
      {cards.map((card, index) => (
        <article
          key={card.id ?? index}
          data-reveal
          className="relative overflow-hidden rounded-md bg-panel p-[25px] lg:p-7"
        >
          <span className="font-label text-[13px] text-faint">
            {String(index + 1).padStart(2, '0')}
            {card.label && ` / ${card.label.toUpperCase()}`}
          </span>
          {visual?.(index)}
          <h3
            className={cn(
              'mt-[30px] text-[25px] leading-[1.25] tracking-[-0.7px] md:text-[20px] lg:text-[23px]',
              typeof titleClassName === 'function' ? titleClassName(index) : titleClassName,
            )}
          >
            <Lines text={card.title} />
          </h3>
          <Paragraphs
            text={card.text}
            className="mt-[15px] text-[14px] leading-[1.8] md:text-[13px]"
          />
          {card.link?.href && (
            <div className="mt-[25px]">
              <Action link={card.link} variant="text" />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
