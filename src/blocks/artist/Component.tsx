import { Asterisk } from '@/components/art/Glyphs'
import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { cn } from '@/lib/cn'

import { BlockSection } from '../BlockSection'
import { populatedOne } from '../populated'
import type { BlockProps } from '../types'

const styles = {
  // The homepage's version: a taller photo and a larger heading on phones.
  large: {
    section: 'gap-[35px] overflow-hidden md:gap-[6%] lg:gap-[10%]',
    photo: 'h-[440px] md:h-[540px] lg:h-[600px]',
    heading: 'text-[46px] leading-[1.13] tracking-[-1.5px] md:text-h2',
  },
  standard: {
    section: 'gap-10 md:gap-[6%] lg:gap-[9%]',
    photo: 'h-[440px] md:h-[520px] lg:h-[580px]',
    heading: 'text-h2',
  },
}

/** The artist's portrait beside a short introduction, or their full bio. */
export function ArtistSection({ block, ctx }: BlockProps<'artist'>) {
  const artist = populatedOne(block.artist)
  const image = block.image ?? artist?.portrait
  const style = styles[block.style ?? 'large']
  const photoRight = block.imageSide === 'right'
  return (
    <BlockSection
      block={block}
      className={cn(
        'grid grid-cols-1 items-center px-site py-section md:grid-cols-2',
        style.section,
      )}
    >
      <div data-reveal className={cn('framed', style.photo, photoRight && 'md:order-2')}>
        <div className="relative size-full">
          <CmsImage
            media={image}
            fill
            sizes="(min-width: 681px) 45vw, 90vw"
            className="object-cover object-[45%]"
          />
        </div>
        {block.imageNote && (
          <span className="absolute bottom-[23px] left-[23px] bg-[#000b] px-2.5 py-[7px] label-xs text-[#ccc]">
            {block.imageNote}
          </span>
        )}
      </div>
      <div data-reveal className="relative z-[1]">
        <Tag number={ctx.number}>{block.tag}</Tag>
        <StyledHeading as={ctx.headingAs} value={block.heading} className={style.heading} />
        {block.text ? (
          <Paragraphs text={block.text} className="mt-[23px] text-[13px] md:text-[14px]" />
        ) : (
          <RichText
            data={artist?.bio}
            className="mt-[23px] text-[14px] [&_a]:text-text [&_a]:underline [&_p+p]:mt-[23px]"
          />
        )}
        <Action link={block.button} variant="outline" className="mt-[30px]" />
        {block.note && (
          <p className="mt-7 border-l border-[#514136] pl-3.5 text-[10px] leading-[1.8] text-[#929292]">
            <Lines text={block.note} />
          </p>
        )}
        {block.signoff && (
          <div className="mt-[35px] flex items-center gap-5 border-t border-line-strong pt-[25px]">
            <Asterisk className="text-[50px]" />
            <span className="label-sm text-[#999]">
              <Lines text={block.signoff} />
            </span>
          </div>
        )}
      </div>
    </BlockSection>
  )
}
