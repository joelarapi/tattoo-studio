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
  className,
}: {
  tag?: string | null
  number?: number
  heading: HeadingValue
  intro?: string | null
  action?: ReactNode
  size?: 'lg' | 'md' | 'sm'
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
        <StyledHeading value={heading} className={headingClass} />
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

/** The top of an inner page: grid background, boxed label, title, intro and a small index line. */
export function PageHero({
  hero,
  short = false,
  children,
  className,
}: {
  hero: {
    tag?: string | null
    heading: HeadingValue
    intro?: string | null
    indexLabel?: string | null
    background?: Media | number | null
  }
  /** A lower minimum height on tablet and desktop (Portfolio, Journal). */
  short?: boolean
  children?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'grid-bg flex min-h-[530px] flex-col items-center justify-center overflow-hidden px-[6%] pt-[65px] pb-[45px] text-center md:pt-[85px] md:pb-[65px]',
        short ? 'md:min-h-[500px]' : 'md:min-h-[570px]',
        className,
      )}
    >
      <HeroPhoto media={hero.background} />
      {hero.tag && (
        <span className="mb-6 rounded-[5px] border border-line bg-panel-2 px-3 py-2 label-xs text-accent md:px-4 md:py-2.5 md:text-[10px]">
          {hero.tag}
        </span>
      )}
      <StyledHeading as="h1" value={hero.heading} className="text-display" />
      {hero.intro && (
        <p className="mt-[23px] text-[14px] md:text-[17px]">
          <Lines text={hero.intro} />
        </p>
      )}
      {children}
      {hero.indexLabel && (
        <span className="mt-[35px] label-xs tracking-[2px] text-faint md:mt-[45px]">
          {hero.indexLabel}
        </span>
      )}
    </section>
  )
}

/** The closing call to action at the end of a page. */
export function EndCta({
  cta,
  as = 'h2',
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
  as?: 'h2' | 'h3'
}) {
  if (!cta?.heading?.text) return null
  return (
    <section className="grid-bg overflow-hidden border-t border-[#222] px-[6%] py-[70px] text-center md:py-[100px]">
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
  text: string
  link?: CmsLink
}

/** Three numbered cards ("01 / Your idea"). `visual` adds a graphic above each title. */
export function NumberedCards({
  cards,
  visual,
  className,
  titleClassName,
}: {
  cards: Card[] | null | undefined
  visual?: (index: number) => ReactNode
  className?: string
  titleClassName?: string
}) {
  if (!cards?.length) return null
  return (
    <div data-reveal-group className={cn('grid grid-cols-1 gap-3 md:grid-cols-3', className)}>
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
              titleClassName,
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
