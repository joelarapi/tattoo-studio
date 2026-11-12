import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PieceGallery } from '@/components/portfolio/PieceGallery'
import { Action } from '@/components/ui/Action'
import { Tag } from '@/components/ui/Tag'
import { Paragraphs } from '@/components/ui/Text'
import { getNavigation, getPieceTemplate, getPortfolioItems, getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { ENQUIRY_ID, pathForDoc } from '@/lib/routes'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const items = await getPortfolioItems()
  return items.flatMap((item) => (item.slug ? [{ slug: item.slug }] : []))
}

async function findPiece(slug: string) {
  const items = await getPortfolioItems()
  const index = items.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { item: items[index], items }
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
const storyText = 'mt-[15px] text-[16px] leading-[1.9]'

const media = (value: number | Media | null | undefined) =>
  value && typeof value === 'object' ? value : null

export default async function PortfolioPiecePage({ params }: Props) {
  const { slug } = await params
  const [piece, detail, navigation] = await Promise.all([
    findPiece(slug),
    getPieceTemplate(),
    getNavigation(),
  ])
  if (!piece) notFound()

  const { item, items } = piece
  // Breadcrumb labels follow the menu.
  const menuLabel = (href: string, fallback: string) =>
    navigation.header?.links?.find((link) => link.href === href)?.label || fallback
  const photos = (item.images ?? []).map(media).filter((m): m is Media => Boolean(m))
  const video = media(item.video)
  const poster = media(item.videoPoster)
  const portfolioPath = pathForDoc('pages', 'portfolio')

  return (
    <main id="main">
      <div className="px-site pt-[35px] pb-[30px] md:pt-section md:pb-[45px]">
        <nav aria-label="Breadcrumb" className="mb-[35px] md:mb-12">
          <ol className="flex flex-wrap gap-2 font-label text-[14px] leading-[1.7] text-[#999] md:gap-3 md:text-[14px]">
            <li>
              <Link href="/" className="hover:text-text">
                {menuLabel('/', 'Home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={portfolioPath} className="hover:text-text">
                {menuLabel(portfolioPath, 'Portfolio')}
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
          {item.title}
        </h1>
        <p className="mt-[23px] max-w-[800px] text-[16px] leading-[1.9] md:text-[16px]">
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
                <figcaption className="mt-3 text-[14px] leading-[1.7] text-[#999]">
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

      <RenderBlocks
        blocks={detail.after}
        titleFromFirst={false}
        context={{ piece: { item, items } }}
      />
    </main>
  )
}
