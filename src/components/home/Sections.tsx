import Link from 'next/link'

import { Asterisk } from '@/components/art/Glyphs'
import { FlashIcon } from '@/components/art/Stencils'
import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { FilmCard } from '@/components/home/FilmCard'
import { Action } from '@/components/ui/Action'
import { NumberedCards, SectionHead } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { ScrollTrack } from '@/components/ui/ScrollTrack'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { cn } from '@/lib/cn'
import { pathForDoc } from '@/lib/routes'
import type { Artist, Homepage, PortfolioItem, Post } from '@/payload-types'

/* The homepage sections between the hero and the enquiry form, in page order. */

/** The tiny credit line above the photos and under the films. */
function CreditLine({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return (
    <p
      className={cn(
        'max-w-[900px] font-label text-[8px] leading-[1.9] text-faint uppercase md:text-[9px] md:leading-[1.8]',
        className,
      )}
    >
      {text}
    </p>
  )
}

/** The portfolio on the homepage: a photo track, then a film track. */
export function WorkSection({
  copy,
  pieces,
  filmCopy,
  films,
  number,
}: {
  copy: Homepage['work']
  pieces: PortfolioItem[]
  filmCopy: Homepage['films']
  /** Pieces with a video and a video cover. */
  films: PortfolioItem[]
  number: number
}) {
  if (!pieces.length && !films.length) return null
  return (
    <section id="work" className="scroll-mt-5 px-site py-section">
      <SectionHead
        tag={copy.tag}
        number={number}
        heading={copy.heading}
        intro={copy.intro}
        action={<Action link={copy.button} variant="outline" />}
      />
      <CreditLine text={copy.creditLine} className="mb-[25px]" />
      {pieces.length > 0 && (
        <ScrollTrack label={copy.trackLabel} ariaLabel="Tattoo photography" colourCycle>
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
        <ScrollTrack label={filmCopy?.trackLabel} ariaLabel="Tattoo films">
          {films.map((item) => (
            <FilmCard
              key={item.id}
              item={item}
              label={filmCopy?.itemLabel}
              watchLabel={filmCopy?.watchLabel}
            />
          ))}
        </ScrollTrack>
      )}
      <CreditLine text={copy.creditLine} />
    </section>
  )
}

export function ArtistSection({ copy, number }: { copy: Homepage['meetArtist']; number: number }) {
  const artist = typeof copy.artist === 'object' ? (copy.artist as Artist) : null
  const image = copy.image ?? artist?.portrait
  return (
    <section
      id="meet-the-artist"
      className="grid grid-cols-1 items-center gap-[35px] overflow-hidden px-site py-section md:grid-cols-2 md:gap-[6%] lg:gap-[10%]"
    >
      <div data-reveal className="framed h-[440px] md:h-[540px] lg:h-[600px]">
        <div className="relative size-full">
          <CmsImage
            media={image}
            fill
            sizes="(min-width: 681px) 45vw, 90vw"
            className="object-cover object-[45%]"
          />
        </div>
        {copy.imageNote && (
          <span className="absolute bottom-[23px] left-[23px] bg-[#000b] px-2.5 py-[7px] label-xs text-[#ccc]">
            {copy.imageNote}
          </span>
        )}
      </div>
      <div data-reveal className="relative z-[1]">
        <Tag number={number}>{copy.tag}</Tag>
        <StyledHeading
          value={copy.heading}
          className="text-[46px] leading-[1.13] tracking-[-1.5px] md:text-h2"
        />
        <Paragraphs text={copy.text} className="mt-[23px] text-[13px] md:text-[14px]" />
        <Action link={copy.button} variant="outline" className="mt-[30px]" />
        {copy.signoff && (
          <div className="mt-[35px] flex items-center gap-5 border-t border-line-strong pt-[25px]">
            <Asterisk className="text-[50px]" />
            <span className="label-sm text-[#999]">
              <Lines text={copy.signoff} />
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export function VisitSection({ copy, number }: { copy: Homepage['visit']; number: number }) {
  return (
    <section
      id="visit"
      className="grid-bg grid grid-cols-1 gap-10 overflow-hidden px-site py-section md:grid-cols-[1.1fr_1fr] md:gap-[7%] lg:gap-[10%]"
    >
      <div data-reveal>
        <Tag number={number}>{copy.tag}</Tag>
        <StyledHeading
          value={copy.heading}
          className="text-[42px] leading-[1.13] tracking-[-1.5px] md:text-h2-lg"
        />
        <Paragraphs text={copy.text} className="mt-[23px] max-w-[400px] text-[14px]" />
        <Action link={copy.button} className="mt-[30px]" />
      </div>
      <div data-reveal>
        {copy.steps?.map((step, index) => (
          <article key={step.id} className="flex gap-[25px] border-t border-line-strong py-[25px]">
            <span className="mt-[5px] font-label text-[11px] text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-h3">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.85] md:text-[12px]">{step.text}</p>
            </div>
          </article>
        ))}
        <Action link={copy.link} variant="plain" className="mt-5" />
      </div>
    </section>
  )
}

export function PlanSection({ copy, number }: { copy: Homepage['plan']; number: number }) {
  const note = copy.priceNote
  return (
    <section id="the-plan" className="border-t border-[#282828] px-site py-section">
      <SectionHead tag={copy.tag} number={number} heading={copy.heading} intro={copy.intro} />
      <NumberedCards
        cards={copy.cards}
        titleClassName="mt-5 md:mt-5"
        visual={(index) => {
          const icon = copy.cards?.[index]?.icon
          return icon ? (
            <FlashIcon
              name={icon}
              className="mt-[22px] block h-[82px] w-[76px] md:mt-[25px] md:h-[91px] md:w-[84px]"
            />
          ) : null
        }}
      />
      {(note?.title || note?.text) && (
        <div
          data-reveal
          className="mt-[25px] flex flex-wrap items-center gap-[15px] border border-line-strong p-[22px] md:flex-nowrap md:gap-[22px] md:p-6"
        >
          <Asterisk className="text-[28px]" />
          <p className="flex-1 basis-[80%] text-[11px] leading-[1.8] md:basis-auto md:text-[12px]">
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
    </section>
  )
}

type PostTeaser = Pick<Post, 'id' | 'title' | 'slug' | 'categories'>

export function JournalSection({
  copy,
  posts,
  number,
}: {
  copy: Homepage['journal']
  posts: PostTeaser[]
  number: number
}) {
  if (!posts.length) return null
  return (
    <section className="px-site pt-[15px] pb-section md:pt-5">
      <SectionHead
        tag={copy.tag}
        number={number}
        heading={copy.heading}
        action={<Action link={copy.link} variant="plain" />}
      />
      <div data-reveal-group className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-[15px]">
        {posts.map((post) => {
          const category = post.categories?.find((c) => typeof c === 'object')
          return (
            <Link
              key={post.id}
              href={pathForDoc('posts', post.slug)}
              data-reveal
              className="relative rounded-[5px] border border-[#222] bg-panel px-[25px] pt-[25px] pb-[55px] transition-colors hover:border-[#666] md:px-5 md:pt-[23px] md:pb-[60px] lg:px-7 lg:pt-[30px] lg:pb-[70px]"
            >
              {typeof category === 'object' && category && (
                <span className="tag label-xs">{category.title}</span>
              )}
              <h3 className="max-w-[90%] text-[27px] leading-[1.25] tracking-[-0.7px] md:text-[23px] lg:text-[26px]">
                {post.title}
              </h3>
              <span
                aria-hidden="true"
                className="absolute right-[25px] bottom-[22px] text-[24px] text-accent"
              >
                ↗&#xFE0E;
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
