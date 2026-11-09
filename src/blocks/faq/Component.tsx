import { FaqList } from '@/components/faq/FaqList'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { getFaqs } from '@/lib/data'
import type { Faq } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import { populated } from '../populated'
import type { BlockOf, BlockProps } from '../types'

/** The chosen questions, or all of them. Nothing to show drops the section. */
export async function loadFaq(block: BlockOf<'faq'>): Promise<Faq[] | null> {
  const chosen = populated(block.faqs)
  const faqs = chosen.length ? chosen : await getFaqs()
  return faqs.length ? faqs : null
}

/** Heading on the left, questions on the right. */
export function FaqSection({ block, data: faqs, ctx }: BlockProps<'faq', Faq[]>) {
  return (
    <BlockSection
      block={block}
      className="grid grid-cols-1 gap-[25px] px-site py-section md:grid-cols-[1fr_1.2fr] md:gap-[8%]"
    >
      <div data-reveal>
        <Tag number={ctx.number}>{block.tag}</Tag>
        <StyledHeading
          as={ctx.headingAs}
          value={block.heading}
          className="text-[40px] leading-[1.13] tracking-[-1.5px] md:text-h2"
        />
      </div>
      <FaqList faqs={faqs} />
    </BlockSection>
  )
}
