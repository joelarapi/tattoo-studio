import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

/** A framed photo beside a heading and text. */
export function ImageText({ block, ctx }: BlockProps<'imageText'>) {
  return (
    <BlockSection
      block={block}
      className="grid grid-cols-1 items-center gap-10 px-site py-section md:grid-cols-2 md:gap-[6%] lg:gap-[9%]"
    >
      <div
        data-reveal
        className={cn('framed h-[440px] md:h-[520px]', block.imageSide === 'right' && 'md:order-2')}
      >
        <div className="relative size-full">
          <CmsImage
            media={block.image}
            fill
            sizes="(min-width: 681px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        {block.imageNote && (
          <span className="absolute bottom-[23px] left-[23px] bg-[#000b] px-2.5 py-[7px] label-xs text-[#ccc]">
            {block.imageNote}
          </span>
        )}
      </div>
      <div data-reveal>
        <Tag number={ctx.number}>{block.tag}</Tag>
        <StyledHeading as={ctx.headingAs} value={block.heading} className="text-h2" />
        <RichText
          data={block.body}
          className="mt-[23px] text-[14px] leading-[1.9] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_ol]:mt-[18px] [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-[23px] [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-5"
        />
        <Action link={block.button} variant="outline" className="mt-[30px]" />
      </div>
    </BlockSection>
  )
}
