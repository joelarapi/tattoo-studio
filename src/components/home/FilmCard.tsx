import Link from 'next/link'

import { PlayIcon } from '@/components/art/Glyphs'
import { CmsImage } from '@/components/ui/CmsImage'
import { pathForDoc } from '@/lib/routes'
import type { PortfolioItem } from '@/payload-types'

/**
 * A film in the homepage's film track: the video's cover, a play mark and the piece's title. It
 * opens the piece's page, where the video plays.
 */
export function FilmCard({
  item,
  label,
  watchLabel,
}: {
  item: PortfolioItem
  /** Top of the card, e.g. "Tisi / film". */
  label?: string | null
  watchLabel?: string | null
}) {
  return (
    <Link
      href={pathForDoc('portfolio-items', item.slug)}
      data-reveal
      className="group relative block h-[440px] overflow-hidden rounded-md border border-line-strong bg-[#161616] text-white after:absolute after:inset-0 after:bg-linear-to-t after:from-[#000d] after:to-transparent after:to-55% after:content-[''] md:h-[420px] lg:h-[510px]"
    >
      <span className="absolute inset-0 opacity-75 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
        <CmsImage
          media={item.videoPoster}
          alt=""
          fill
          sizes="(min-width: 681px) 33vw, 86vw"
          draggable={false}
          className="object-cover select-none"
        />
      </span>
      {label && (
        <span className="absolute top-[15px] left-[13px] z-[1] label-xs md:top-5 md:left-5 md:text-[9px]">
          {label}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute top-[45%] left-1/2 z-[1] grid size-[45px] -translate-1/2 place-items-center rounded-full border border-[#ffffff90] bg-[#0003] md:size-[60px]"
      >
        <PlayIcon className="ml-0.5 size-3 md:size-4" />
      </span>
      <span className="absolute right-3 bottom-5 left-3.5 z-[1] md:right-[22px] md:bottom-[25px] md:left-[22px]">
        <b className="block text-[22px] font-normal tracking-[-1px]">{item.title}</b>
        {watchLabel && (
          <span className="mt-3 block label-xs text-[#aaa]">{watchLabel} ↗&#xFE0E;</span>
        )}
      </span>
    </Link>
  )
}
