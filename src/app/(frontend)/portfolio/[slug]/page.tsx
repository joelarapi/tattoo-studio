import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { categoryName, pieceNumber } from '@/components/cards/PortfolioCard'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { Lightbox } from '@/components/ui/Lightbox'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Paragraphs } from '@/components/ui/Text'
import { getNavigation, getPortfolioItems, getPortfolioPage, getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { ENQUIRY_ID, PAGE_GLOBALS, pathForDoc } from '@/lib/routes'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const items = await getPortfolioItems()
  return items.flatMap((item) => (item.slug ? [{ slug: item.slug }] : []))
}

async function findPiece(slug: string) {
  const items = await getPortfolioItems()
  const index = items.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { item: items[index], position: index + 1, items }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [piece, settings] = await Promise.all([findPiece(slug), getSiteSettings()])
  if (!piece) return {}
  return pageMetadata({
    settings,
    meta: piece.item.meta,
    fallbackTitle: piece.item.title,
    fallbackDescription: piece.item.summary,
    image: piece.item.images?.[0],
    path: pathForDoc('portfolio-items', slug),
  })
}

const media = (value: number | Media | null | undefined) =>
  value && typeof value === 'object' ? value : null

export default async function PortfolioPiecePage({ params }: Props) {
  const { slug } = await params
  const [piece, page, navigation] = await Promise.all([
    findPiece(slug),
    getPortfolioPage(),
    getNavigation(),
  ])
  if (!piece) notFound()

  const { item, position, items } = piece
  // Breadcrumb labels follow the menu.
  const menuLabel = (href: string, fallback: string) =>
    navigation.header?.links?.find((link) => link.href === href)?.label || fallback
  const { detail } = page
  const [main, ...more] = (item.images ?? []).map(media).filter((m): m is Media => Boolean(m))
  const video = media(item.video)
  // The next three pieces, wrapping round to the start.
  const suggestions = [...items.slice(position), ...items.slice(0, position - 1)].slice(0, 3)
  const facts = [
    { label: 'Category', value: categoryName(item) },
    { label: 'Placement', value: item.placement },
  ].filter((fact) => fact.value)

  return (
    <main id="main">
      <div className="pt-section px-site pb-[45px]">
        <nav aria-label="Breadcrumb" className="mb-[35px] md:mb-12">
          <ol className="flex flex-wrap gap-2 font-label text-[9px] leading-[1.7] text-[#999] md:gap-3 md:text-[10px]">
            <li>
              <Link href="/" className="hover:text-text">
                {menuLabel('/', 'Home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={PAGE_GLOBALS['portfolio-page']} className="hover:text-text">
                {menuLabel(PAGE_GLOBALS['portfolio-page'], 'Portfolio')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#ccc]">
              {item.title}
            </li>
          </ol>
        </nav>
        <Tag>
          {detail.studyLabel ? `${detail.studyLabel} / ` : ''}
          {pieceNumber(position)}
        </Tag>
        <h1 className="max-w-[1000px] text-[45px] leading-[1.1] tracking-[-2px] md:text-[clamp(45px,6vw,85px)] md:tracking-[-3px]">
          {item.title}
          <span className="text-soft">.</span>
        </h1>
        <p className="mt-[23px] max-w-[800px] text-[14px] leading-[1.9] md:text-[16px]">
          {item.summary}
        </p>
      </div>

      <section className="pb-section grid grid-cols-1 items-start gap-[35px] px-site pt-2.5 md:grid-cols-[1.2fr_1fr] md:gap-[7%]">
        <div className="flex flex-col gap-5">
          {main && (
            <div className="relative rounded-[5px] border border-line-strong bg-panel-2 p-2.5">
              <CmsImage
                media={main}
                sizes="(min-width: 681px) 55vw, 90vw"
                loading="eager"
                fetchPriority="high"
                className="block h-auto max-h-[650px] w-full object-contain md:max-h-[900px]"
              />
              <Lightbox href={main.url ?? '#'} className="absolute top-[22px] right-[22px]">
                <CmsImage
                  media={main}
                  sizes="95vw"
                  className="m-auto block h-auto max-h-[72vh] w-auto max-w-[80vw] md:max-h-[80vh] md:max-w-[85vw]"
                />
              </Lightbox>
            </div>
          )}
          {more.map((image) => (
            <div
              key={image.id}
              className="rounded-[5px] border border-line-strong bg-panel-2 p-2.5"
            >
              <CmsImage
                media={image}
                sizes="(min-width: 681px) 55vw, 90vw"
                className="block h-auto w-full object-contain"
              />
            </div>
          ))}
          {video?.url && (
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-[5px] border border-line-strong bg-black"
            >
              <source src={video.url} type={video.mimeType ?? undefined} />
            </video>
          )}
        </div>

        <div data-reveal>
          {detail.storyLabel && <Tag>{detail.storyLabel}</Tag>}
          {item.detailsHeading && (
            <h2 className="text-[36px] leading-[1.13] tracking-[-1.8px] md:text-[33px] lg:text-[42px]">
              {item.detailsHeading}
            </h2>
          )}
          {facts.length > 0 && (
            <dl className="mt-7 mb-[35px]">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-2 gap-5 border-b border-line-strong py-[13px] text-[11px]"
                >
                  <dt className="text-[#888]">{fact.label}</dt>
                  <dd className="text-[#ddd]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {item.story?.map((part) => (
            <div key={part.id}>
              {part.title && (
                <h3 className="mt-[27px] text-[24px] leading-[1.25] tracking-[-0.7px]">
                  {part.title}
                </h3>
              )}
              <Paragraphs
                text={part.text}
                className="mt-[15px] text-[14px] leading-[1.9] md:text-[13px]"
              />
            </div>
          ))}
          <Action
            href={`/contact?project=${encodeURIComponent(slug)}#${ENQUIRY_ID}`}
            className="mt-7"
          >
            {detail.ctaLabel}
          </Action>
        </div>
      </section>

      {detail.travel?.heading?.text && (
        <section className="border-y border-line bg-[#101010] px-site py-section">
          <div data-reveal>
            <Tag>{detail.travel.tag}</Tag>
            <StyledHeading
              value={detail.travel.heading}
              className="text-[37px] leading-[1.13] tracking-[-1.5px] md:text-[45px] md:tracking-[-2px]"
            />
          </div>
          <Paragraphs
            text={detail.travel.text}
            className="mt-[23px] max-w-[700px] text-[14px] leading-[1.9]"
          />
          {!!detail.travel.links?.length && (
            <div className="mt-7 flex flex-wrap gap-[15px]">
              {detail.travel.links.map((link) => (
                <Action key={link.id} link={link} variant="outline" />
              ))}
            </div>
          )}
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="border-b border-line px-site py-section">
          <div
            data-reveal
            className="mb-[35px] md:flex md:items-end md:justify-between md:gap-[30px]"
          >
            <div>
              <Tag>{detail.suggestions.tag}</Tag>
              <StyledHeading
                value={detail.suggestions.heading}
                className="text-[36px] leading-[1.13] tracking-[-1.5px] md:text-[45px] md:tracking-[-2px]"
              />
            </div>
            <Action
              link={detail.suggestions.button}
              variant="outline"
              className="mt-[25px] md:mt-0"
            />
          </div>
          <div data-reveal-group className="grid grid-cols-1 gap-[35px] md:grid-cols-3 md:gap-6">
            {suggestions.map((other) => (
              <Link
                key={other.id}
                href={pathForDoc('portfolio-items', other.slug)}
                data-reveal
                className="group block"
              >
                <div className="relative h-[390px] overflow-hidden rounded-[5px] border border-line-strong bg-panel-2 md:h-[340px]">
                  <CmsImage
                    media={other.images?.[0]}
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
                {detail.suggestions.cardLink && (
                  <span className="mt-3.5 link-text">{detail.suggestions.cardLink} ↗&#xFE0E;</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
