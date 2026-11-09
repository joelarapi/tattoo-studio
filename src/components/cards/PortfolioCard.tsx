import Link from 'next/link'

import { CmsImage } from '@/components/ui/CmsImage'
import { cn } from '@/lib/cn'
import { pathForDoc } from '@/lib/routes'
import type { PortfolioItem } from '@/payload-types'

export const pieceNumber = (position: number) => String(position).padStart(3, '0')

export const categoryName = (item: Pick<PortfolioItem, 'style'>) =>
  typeof item.style === 'object' ? item.style.name : ''

/** A portfolio piece: photo, title and number, category and placement, short description. */
export function PortfolioCard({
  item,
  position,
  imageClassName,
  className,
}: {
  item: PortfolioItem
  /** 1-based position in its list, shown as "001". */
  position: number
  imageClassName?: string
  className?: string
}) {
  // A piece with only a video uses the video cover.
  const cover = item.images?.[0] ?? item.videoPoster
  return (
    <Link
      href={pathForDoc('portfolio-items', item.slug)}
      data-reveal
      className={cn('group block min-w-0 self-start', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-md bg-panel-2',
          imageClassName ?? 'h-[440px] md:h-[280px] lg:h-[360px] 2xl:h-[430px]',
        )}
      >
        <CmsImage
          media={cover}
          fill
          sizes="(min-width: 681px) 33vw, 86vw"
          draggable={false}
          className="object-cover transition-transform duration-400 select-none group-hover:scale-[1.035] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute top-[18px] right-[18px] border border-[#9996] bg-[#111b] px-[13px] py-1.5 text-text"
        >
          ↗&#xFE0E;
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <h3 className="text-[25px] leading-[1.13] tracking-[-1px] md:text-[21px] lg:text-[23px]">
          {item.title}
        </h3>
        <span className="font-label text-[12px] text-faint lg:text-[16px]">
          {pieceNumber(position)}
        </span>
      </div>
      <p className="mt-3 flex justify-between gap-2.5 border-t border-line-strong pt-3 label-sm text-[#999] md:flex-col md:gap-1 lg:flex-row">
        {categoryName(item)}
        {item.placement && <span>{item.placement}</span>}
      </p>
      {item.summary && (
        <p className="mt-4 text-[13px] leading-[1.85] md:text-[12px]">{item.summary}</p>
      )}
    </Link>
  )
}
