import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PieceGallery } from '@/components/portfolio/PieceGallery'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
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
    image: piece.item.images?.[0] ?? piece.item.videoPoster,
    path: pathForDoc('portfolio-items', slug),
  })
}

const storyTitle = 'mt-[27px] text-[24px] leading-[1.25] tracking-[-0.7px]'
const storyText = 'mt-[15px] text-[14px] leading-[1.9] md:text-[13px]'

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
  const photos = (item.images ?? []).map(media).filter((m): m is Media => Boolean(m))
  const video = media(item.video)
  const poster = media(item.videoPoster)
  // Three more pieces: one, three and six places on, wrapping round to the start.
  const suggestions = [
    ...new Set([1, 3, 6].map((offset) => items[(position - 1 + offset) % items.length])),
  ]
    .filter((other) => other.id !== item.id)
    .slice(0, 3)

  return (
    <main id="main">
      <div className="px-site pt-[35px] pb-[30px] md:pt-section md:pb-[45px]">
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
        <Tag>{detail.label}</Tag>
        <h1 className="max-w-[1000px] text-[45px] leading-[1.1] tracking-[-2px] md:text-[clamp(45px,6vw,85px)] md:tracking-[-3px]">
          {item.title}.
        </h1>
        <p className="mt-[23px] max-w-[800px] text-[14px] leading-[1.9] md:text-[16px]">
          {item.summary}
        </p>
      </div>

      <section className="grid grid-cols-1 items-start gap-[35px] px-site pt-2.5 pb-section md:grid-cols-[1.1fr_1fr] md:gap-[5%] lg:grid-cols-[1.2fr_1fr] lg:gap-[7%]">
        <div className="grid gap-6">
          <PieceGallery photos={photos} label={detail.photoLabel} />
          {video?.url && (
            <figure>
              <video
                controls
                playsInline
                preload="none"
                poster={poster?.sizes?.hero?.url ?? poster?.url ?? undefined}
                aria-label={video.alt || item.title}
                className="block max-h-[800px] w-full bg-panel"
              >
                <source src={video.url} type={video.mimeType ?? undefined} />
              </video>
              {detail.videoCaption && (
                <figcaption className="mt-3 text-[12px] leading-[1.7] text-[#999]">
                  {item.title}. {detail.videoCaption}
                </figcaption>
              )}
            </figure>
          )}
        </div>

        <div data-reveal className="md:sticky md:top-[25px]">
          {item.placement && <Tag>{item.placement}</Tag>}
          {(item.detailsHeading || detail.storyHeading) && (
            <h2 className="text-[36px] leading-[1.13] tracking-[-1.8px] md:text-[33px] lg:text-[42px]">
              {item.detailsHeading || detail.storyHeading}
            </h2>
          )}
          <Paragraphs text={item.summary} className={storyText} />
          <Paragraphs text={detail.storyNote} className={storyText} />
          {item.story?.map((part) => (
            <div key={part.id}>
              {part.title && <h3 className={storyTitle}>{part.title}</h3>}
              <Paragraphs text={part.text} className={storyText} />
            </div>
          ))}
          {detail.direction?.title && <h3 className={storyTitle}>{detail.direction.title}</h3>}
          <Paragraphs text={detail.direction?.text} className={storyText} />
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
