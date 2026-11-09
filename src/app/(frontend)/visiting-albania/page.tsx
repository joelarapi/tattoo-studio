import type { Metadata } from 'next'

import { DestinationMotif, SupportSymbol } from '@/components/art/Glyphs'
import { FaqList } from '@/components/faq/FaqList'
import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { EndCta, HeroPhoto, Notice, NumberedCards } from '@/components/ui/Blocks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { getFaqs, getSiteSettings, getVisitingPage } from '@/lib/data'
import { headingText, type HeadingValue } from '@/lib/heading'
import { pageMetadata } from '@/lib/metadata'
import { PAGE_GLOBALS } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getVisitingPage(), getSiteSettings()])
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: headingText(page.hero.heading),
    fallbackDescription: page.hero.intro,
    path: PAGE_GLOBALS['visiting-page'],
  })
}

/** Label, heading and a short intro on the right, as at the top of each guide section. */
function GuideHead({
  tag,
  number,
  heading,
  intro,
}: {
  tag?: string | null
  number: number
  heading: HeadingValue
  intro?: string | null
}) {
  return (
    <div data-reveal className="mb-10 md:flex md:items-end md:justify-between md:gap-[25px]">
      <div>
        <Tag number={number}>{tag}</Tag>
        <StyledHeading value={heading} className="text-h2-sm" />
      </div>
      {intro && (
        <p className="mt-5 max-w-[370px] text-[13px] md:mt-0">
          <Lines text={intro} />
        </p>
      )}
    </div>
  )
}

export default async function VisitingAlbaniaPage() {
  const [page, faqs] = await Promise.all([getVisitingPage(), getFaqs('visiting')])
  const { hero, plan, stay, explore, itinerary, questions } = page

  const sections = [
    { id: 'plan', label: plan.navLabel },
    { id: 'stay', label: stay.navLabel },
    { id: 'explore', label: explore.navLabel },
    { id: 'questions', label: faqs.length ? questions.navLabel : null },
  ].filter((section) => section.label)

  return (
    <main id="main">
      <section className="grid-bg grid grid-cols-1 items-center gap-10 overflow-hidden px-[6%] py-[60px] md:grid-cols-[1.2fr_1fr] md:gap-[5%] md:px-[5%] lg:gap-[9%] lg:px-site lg:py-20">
        <HeroPhoto media={hero.background} />
        <div>
          <Tag>{hero.tag}</Tag>
          <StyledHeading
            as="h1"
            value={hero.heading}
            className="text-[49px] leading-[1.06] tracking-[-2.5px] md:text-[clamp(48px,5.5vw,84px)] md:tracking-[-3.5px]"
          />
          <Paragraphs text={hero.intro} className="mt-[23px] max-w-[540px] text-[15px]" />
          <Action link={hero.button} className="mt-[30px]" />
          <Paragraphs
            text={hero.note}
            className="mt-[23px] max-w-[540px] text-[10px] leading-[1.85] text-[#969696]"
          />
        </div>
        {!!hero.route?.stops?.length && (
          <div
            data-reveal
            className="relative rounded-md border border-[#343434] bg-[#111b] p-[25px] lg:px-[35px] lg:py-[30px]"
          >
            {hero.route.title && (
              <span className="block label-xs text-[#888]">{hero.route.title}</span>
            )}
            <ol>
              {hero.route.stops.map((stop, index, all) => (
                <li key={stop.id} className="relative flex gap-5 pt-[38px] lg:gap-[25px]">
                  {index < all.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-[57px] left-2 h-full border-l border-dashed border-[#694028]"
                    />
                  )}
                  <i className="relative z-[1] mt-1.5 size-[17px] shrink-0 rounded-full border border-accent bg-panel shadow-[0_0_0_6px_#ff51000b]" />
                  <div>
                    <span className="font-label text-[9px] tracking-[1px] text-accent uppercase">
                      {String(index + 1).padStart(2, '0')}
                      {stop.label && ` / ${stop.label}`}
                    </span>
                    <b className="mt-2 block text-[30px] leading-[1.2] font-normal tracking-[-1.5px] text-text lg:text-[36px]">
                      {stop.title}
                    </b>
                    {stop.text && <p className="mt-2.5 text-[11px]">{stop.text}</p>}
                  </div>
                </li>
              ))}
            </ol>
            {hero.route.footnote && (
              <span className="mt-[35px] block label-xs text-[#888]">{hero.route.footnote}</span>
            )}
          </div>
        )}
      </section>

      {sections.length > 0 && (
        <nav
          aria-label="On this page"
          className="flex flex-wrap justify-between gap-x-5 gap-y-3 border-y border-line bg-[#101010] px-site py-[23px]"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="font-label text-[8px] text-text uppercase hover:text-accent md:text-[9px]"
            >
              {section.label} ↓&#xFE0E;
            </a>
          ))}
        </nav>
      )}

      <section id="plan" className="scroll-mt-5 px-site py-section">
        <GuideHead tag={plan.tag} number={1} heading={plan.heading} intro={plan.intro} />
        <NumberedCards cards={plan.cards} />
      </section>

      <section
        id="stay"
        className="scroll-mt-5 border-y border-line bg-[#0d0d0d] px-site py-section"
      >
        <GuideHead tag={stay.tag} number={2} heading={stay.heading} intro={stay.intro} />
        <div data-reveal-group className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {stay.cards?.map((card) => (
            <article
              key={card.id}
              data-reveal
              className="rounded-md border border-line bg-panel-2 p-[25px] lg:p-[35px]"
            >
              <SupportSymbol name={card.symbol} className="mt-[5px] mb-[30px] size-[52px]" />
              <Tag className="mb-3">{card.tag}</Tag>
              <h3 className="text-[28px] leading-[1.2] tracking-[-1px] lg:text-[32px]">
                {card.title}
              </h3>
              <Paragraphs text={card.text} className="mt-[23px] text-[14px]" />
              {card.bullets && (
                <ul className="mt-5 mb-[25px] list-disc pl-[18px] text-[12px] leading-[2] text-[#aaa]">
                  {card.bullets
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line) => (
                      <li key={line}>{line.trim()}</li>
                    ))}
                </ul>
              )}
              <Action link={card.button} variant="outline" className="text-[9px]" />
            </article>
          ))}
        </div>
        {stay.notice && (
          <Notice className="my-[25px]">
            <Lines text={stay.notice} />
          </Notice>
        )}
        {stay.arrival?.title && (
          <div className="grid grid-cols-1 gap-4 border-t border-line-strong pt-[25px] md:grid-cols-[1fr_2fr] md:gap-[8%]">
            <h3 className="text-h3">{stay.arrival.title}</h3>
            <RichText
              data={stay.arrival.text}
              className="text-[13px] leading-[1.9] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-[3px]"
            />
          </div>
        )}
      </section>

      <section id="explore" className="scroll-mt-5 px-site py-section">
        <GuideHead tag={explore.tag} number={3} heading={explore.heading} intro={explore.intro} />
        <div data-reveal-group className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {explore.destinations?.map((place) => (
            <article
              key={place.id}
              data-reveal
              className="rounded-[5px] border border-line bg-panel px-[18px] pt-[18px] pb-[30px] lg:px-[25px] lg:pt-5"
            >
              <div className="mb-[25px] grid h-[180px] place-items-center overflow-hidden bg-[linear-gradient(#ffffff05_1px,transparent_1px),linear-gradient(90deg,#ffffff05_1px,transparent_1px)] bg-size-[30px_30px] lg:h-[220px]">
                <DestinationMotif motif={place.motif} className="h-[120px] w-[160px]" />
              </div>
              <Tag className="mb-3 text-[8px] md:text-[8px]">{place.tag}</Tag>
              <h3 className="text-[36px] leading-[1.15] tracking-[-1.2px]">{place.title}</h3>
              <Paragraphs text={place.text} className="mt-[15px] text-[13px] leading-[1.85]" />
              <Action link={place.link} variant="text" className="mt-[25px] text-[8px]" />
            </article>
          ))}
        </div>
        <Paragraphs
          text={explore.note}
          className="mt-[23px] text-[10px] leading-[1.85] text-[#969696]"
        />
        {explore.slow?.title && (
          <div
            data-reveal
            className="mt-[45px] grid grid-cols-1 gap-x-[8%] gap-y-5 border-t border-line-strong pt-[35px] md:grid-cols-[1fr_1.5fr]"
          >
            <Tag className="m-0 md:col-span-2">{explore.slow.tag}</Tag>
            <h3 className="text-[30px] leading-[1.2] tracking-[-1px]">
              <Lines text={explore.slow.title} />
            </h3>
            <Paragraphs text={explore.slow.text} className="text-[14px] leading-[1.85]" />
          </div>
        )}
      </section>

      {!!itinerary.items?.length && (
        <section className="grid-bg grid grid-cols-1 gap-10 overflow-hidden px-site py-section md:grid-cols-2 md:gap-[10%]">
          <div data-reveal>
            <Tag number={4}>{itinerary.tag}</Tag>
            <StyledHeading value={itinerary.heading} className="text-h2" />
            <Paragraphs text={itinerary.text} className="mt-[23px] max-w-[450px] text-[13px]" />
          </div>
          <ol className="list-decimal pl-[25px] marker:font-label marker:text-[14px] marker:text-accent">
            {itinerary.items.map((item) => (
              <li key={item.id} data-reveal className="pb-[30px] pl-3">
                {item.label && <span className="label-sm text-[#999]">{item.label}</span>}
                <h3 className="mt-2.5 text-[25px] leading-[1.25] tracking-[-0.7px]">
                  {item.title}
                </h3>
                {item.text && <p className="mt-[13px] text-[13px] text-[#aaa]">{item.text}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {faqs.length > 0 && (
        <section
          id="questions"
          className="grid scroll-mt-5 grid-cols-1 gap-[25px] border-t border-line px-site py-section md:grid-cols-[1fr_1.2fr] md:gap-[8%]"
        >
          <div data-reveal>
            <Tag number={5}>{questions.tag}</Tag>
            <StyledHeading value={questions.heading} className="text-h2" />
          </div>
          <FaqList faqs={faqs} />
        </section>
      )}

      <EndCta cta={page.endCta} />
    </main>
  )
}
