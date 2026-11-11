import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines } from '@/components/ui/Text'
import { formatDate } from '@/lib/format'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

const bodyClass =
  'text-[14px] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_ol]:mt-[23px] [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-[23px] [&_ul]:mt-[23px] [&_ul]:list-disc [&_ul]:pl-5'

function Note({ text }: { text?: string | null }) {
  if (!text) return null
  return (
    <p className="mt-7 border-l border-[#514136] pl-3.5 text-[16px] leading-[1.8] text-[#929292]">
      <Lines text={text} />
    </p>
  )
}

/** Text in three layouts: heading beside it, heading above it, or one narrow document column. */
export function TextSection({ block, ctx }: BlockProps<'text'>) {
  if (block.layout === 'document') {
    return (
      <BlockSection block={block} className="px-site pt-[45px] pb-section md:pt-[65px]">
        <div className="mx-auto max-w-[760px]">
          <StyledHeading
            as={ctx.headingAs}
            value={block.heading}
            className="text-[49px] leading-[1.06] tracking-[-2px] md:text-[clamp(46px,6vw,80px)] md:tracking-[-3px]"
          />
          {block.showUpdated && ctx.updatedAt && (
            <p className="mt-6 label text-faint">Last updated {formatDate(ctx.updatedAt)}</p>
          )}
          <RichText
            data={block.body}
            className="mt-10 text-[16px] leading-[1.9] md:text-[16px] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_ol]:mt-[23px] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-[23px] [&_ul]:mt-[23px] [&_ul]:list-disc [&_ul]:pl-5"
          />
        </div>
      </BlockSection>
    )
  }

  if (block.layout === 'stacked') {
    return (
      <BlockSection block={block} className="px-site py-section">
        <div data-reveal className="max-w-[760px]">
          <Tag number={ctx.number}>{block.tag}</Tag>
          <StyledHeading as={ctx.headingAs} value={block.heading} className="text-h2" />
          <RichText data={block.body} className={`mt-[23px] ${bodyClass}`} />
          <Action link={block.link} variant="text" className="mt-[25px]" />
          <Note text={block.note} />
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection block={block} className="px-site py-section">
      <Tag number={ctx.number} className="mb-[25px] md:mb-[45px]">
        {block.tag}
      </Tag>
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-[6%] lg:gap-[9%]">
        <div data-reveal>
          <StyledHeading as={ctx.headingAs} value={block.heading} className="text-h2" />
        </div>
        <div data-reveal>
          <RichText data={block.body} className={bodyClass} />
          <Action link={block.link} variant="text" className="mt-[25px]" />
          <Note text={block.note} />
        </div>
      </div>
    </BlockSection>
  )
}
