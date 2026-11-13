import Link from 'next/link'

import { pathForDoc } from '@/lib/routes'
import type { PortfolioItem } from '@/payload-types'

/** An inline, full-colour tattoo video with a separate link to the portfolio story. */
export function FilmCard({
  item,
  label,
  watchLabel,
}: {
  item: PortfolioItem
  label?: string | null
  watchLabel?: string | null
}) {
  const video = typeof item.video === 'object' ? item.video : null
  const poster = typeof item.videoPoster === 'object' ? item.videoPoster : null
  if (!video?.url) return null

  const detailsLabel =
    !watchLabel || watchLabel.trim().toLowerCase() === 'watch the tattoo video'
      ? 'View tattoo details'
      : watchLabel

  return (
    <article
      data-reveal
      className="overflow-hidden rounded-md border border-line-strong bg-[#161616] text-white"
    >
      <div className="relative bg-black">
        <video
          controls
          playsInline
          preload="none"
          poster={poster?.url ?? undefined}
          aria-label={`${item.title} video`}
          className="block h-[330px] w-full object-contain md:h-[310px] lg:h-[400px]"
        >
          <source src={video.url} type={video.mimeType ?? undefined} />
          Your browser cannot play this video.
        </video>
        {label && (
          <span className="pointer-events-none absolute top-3 left-3 rounded-sm bg-black/70 px-2 py-1 label-xs">
            {label}
          </span>
        )}
      </div>
      <div className="p-4 md:p-5">
        <h3 className="text-[22px] font-normal tracking-[-1px]">{item.title} — Video</h3>
        <Link
          href={pathForDoc('portfolio-items', item.slug)}
          className="mt-3 link-text inline-block"
          aria-label={`${detailsLabel}: ${item.title}`}
        >
          {detailsLabel} ↗&#xFE0E;
        </Link>
      </div>
    </article>
  )
}
