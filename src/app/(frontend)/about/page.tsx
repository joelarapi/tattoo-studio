import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Asterisk } from '@/components/art/Glyphs'
import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { EndCta, NumberedCards, PageHero } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { getAboutPage, getSiteSettings } from '@/lib/data'
import { headingText } from '@/lib/heading'
import { pageMetadata } from '@/lib/metadata'
import { PAGE_GLOBALS } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getAboutPage(), getSiteSettings()])
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: headingText(page.hero.heading),
    fallbackDescription: page.hero.intro,
    path: PAGE_GLOBALS['about-page'],
  })
}

const ARTIST_ID = 'artist'

/** Small graphics for the three "your idea" cards, from the design. */
const valueVisuals: ReactNode[] = [
  <div
    key="circles"
    aria-hidden="true"
    className="flex h-[150px] items-center justify-center gap-2 md:h-[180px]"
  >
    <i className="size-[55px] rounded-full bg-linear-[130deg] from-[#fb9363] to-[#db3e00] shadow-[4px_4px_0_#562710] md:size-[35px] lg:size-12" />
    <i className="size-[55px] rounded-full bg-linear-90 from-[#ef6c36] from-50% to-[#282828] to-50% shadow-[4px_4px_0_#562710] md:size-[35px] lg:size-12" />
    <i className="size-[55px] rounded-full bg-[#292929] shadow-[4px_4px_0_#191919] md:size-[35px] lg:size-12" />
  </div>,
  <div
    key="bars"
    aria-hidden="true"
    className="flex h-[150px] items-center justify-center md:h-[180px]"
  >
    <span className="-skew-y-8 bg-linear-90 from-accent via-[#543121] via-65% to-[#333] bg-clip-text text-[100px] font-bold tracking-[-8px] text-transparent">
      ||||||||
    </span>
  </div>,
  <div
    key="orbit"
    aria-hidden="true"
    className="flex h-[150px] items-center justify-center md:h-[180px]"
  >
    <Asterisk className="text-[110px] drop-shadow-[4px_3px_0_#773116]" />
  </div>,
]

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getAboutPage(), getSiteSettings()])
  const { meetArtist, focus, values, studio } = page
  const artist = typeof meetArtist.artist === 'object' ? meetArtist.artist : null
  const image = meetArtist.image ?? artist?.portrait

  return (
    <main id="main">
      <PageHero hero={page.hero}>
        {page.hero.scrollLabel && (
          <a href={`#${ARTIST_ID}`} className="mt-[35px] block label">
            {page.hero.scrollLabel} ↓&#xFE0E;
          </a>
        )}
      </PageHero>

      <section
        id={ARTIST_ID}
        className="grid scroll-mt-5 grid-cols-1 items-center gap-10 px-site py-section md:grid-cols-2 md:gap-[6%] lg:gap-[9%]"
      >
        <div data-reveal className="framed h-[440px] md:h-[520px] lg:h-[580px]">
          <div className="relative size-full">
            <CmsImage
              media={image}
              fill
              sizes="(min-width: 681px) 45vw, 90vw"
              className="object-cover object-[45%]"
            />
          </div>
        </div>
        <div data-reveal>
          <Tag>{meetArtist.tag}</Tag>
          <StyledHeading value={meetArtist.heading} className="text-h2" />
          <RichText
            data={artist?.bio}
            className="mt-[23px] text-[14px] [&_a]:text-text [&_a]:underline [&_p+p]:mt-[23px]"
          />
          <Action link={meetArtist.button} variant="outline" className="mt-[30px]" />
          {meetArtist.note && (
            <p className="mt-7 border-l border-[#514136] pl-3.5 text-[10px] leading-[1.8] text-[#929292]">
              <Lines text={meetArtist.note} />
            </p>
          )}
        </div>
      </section>

      {!!focus.items?.length && (
        <section className="border-t border-line bg-[#0b0b0b] px-site py-section">
          <div data-reveal className="mb-10 md:flex md:items-end md:justify-between md:gap-[25px]">
            <div>
              <Tag>{focus.tag}</Tag>
              <StyledHeading value={focus.heading} className="text-h2-sm" />
            </div>
            {focus.intro && (
              <p className="mt-[22px] text-[13px] text-[#aaa] md:mt-0">
                <Lines text={focus.intro} />
              </p>
            )}
          </div>
          <div data-reveal-group className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {focus.items.map((item, index) => (
              <article
                key={item.id}
                data-reveal
                className="rounded-[5px] border border-[#2b2b2b] bg-[#141414] p-[27px] md:p-[35px]"
              >
                <span className="font-label text-[10px] text-[#c8784b] uppercase">
                  {String(index + 1).padStart(2, '0')}
                  {item.label && ` / ${item.label}`}
                </span>
                <h3 className="mt-7 text-[28px] leading-[1.2] tracking-[-1px] md:text-[30px]">
                  <Lines text={item.title} />
                </h3>
                <Paragraphs text={item.text} className="mt-[23px] text-[13px] leading-[1.9]" />
                <Action link={item.link} variant="text" className="mt-[25px]" />
              </article>
            ))}
          </div>
        </section>
      )}

      {!!values.cards?.length && (
        <section className="px-site py-section">
          <div data-reveal className="mb-10">
            <Tag>{values.tag}</Tag>
            <StyledHeading value={values.heading} className="text-h2-sm" />
          </div>
          <NumberedCards cards={values.cards} visual={(index) => valueVisuals[index % 3]} />
        </section>
      )}

      <section className="border-y border-[#222] px-site py-section">
        <Tag className="mb-[25px] md:mb-[45px]">{studio.tag}</Tag>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-[6%] lg:gap-[9%]">
          <div data-reveal>
            <StyledHeading value={studio.heading} className="text-h2" />
          </div>
          <div data-reveal>
            <Paragraphs text={studio.text} className="mt-[23px] text-[14px] first:mt-0" />
            <Action link={studio.link} variant="text" className="mt-[25px]" />
            {studio.note && (
              <p className="mt-7 border-l border-[#514136] pl-3.5 text-[10px] leading-[1.8] text-[#929292]">
                <Lines text={studio.note} />
              </p>
            )}
          </div>
        </div>
      </section>

      <EndCta cta={settings.endCta} />
    </main>
  )
}
