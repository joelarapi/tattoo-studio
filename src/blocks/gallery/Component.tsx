import { SectionHead } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import { populated } from '../populated'
import type { BlockProps } from '../types'

/** Photos in a grid of two or three columns, with optional captions from their alt text. */
export function Gallery({ block, ctx }: BlockProps<'gallery'>) {
  const photos = populated<Media>(block.images)
  if (!photos.length) return null
  return (
    <BlockSection block={block} className="px-site py-section">
      {block.heading?.text && (
        <SectionHead
          tag={block.tag}
          number={ctx.number}
          heading={block.heading}
          intro={block.intro}
          size="md"
          as={ctx.headingAs}
        />
      )}
      <div
        data-reveal-group
        className={cn(
          'grid grid-cols-1 gap-3 md:gap-5',
          block.columns === '2' ? 'md:grid-cols-2' : 'md:grid-cols-3',
        )}
      >
        {photos.map((photo) => (
          <figure key={photo.id} data-reveal>
            <div className="relative h-[420px] overflow-hidden rounded-md bg-panel-2 md:h-[360px] lg:h-[440px]">
              <CmsImage
                media={photo}
                fill
                sizes={
                  block.columns === '2'
                    ? '(min-width: 681px) 45vw, 90vw'
                    : '(min-width: 681px) 30vw, 90vw'
                }
                className="object-cover"
              />
            </div>
            {block.showCaptions && photo.alt && (
              <figcaption className="mt-3 text-[14px] leading-[1.7] text-[#999]">
                {photo.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </BlockSection>
  )
}
