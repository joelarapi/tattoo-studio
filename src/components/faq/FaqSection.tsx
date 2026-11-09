import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import type { HeadingValue } from '@/lib/heading'
import type { Faq } from '@/payload-types'

import { FaqList } from './FaqList'

/** Heading on the left, questions on the right. Renders nothing without questions. */
export function FaqSection({
  copy,
  faqs,
  number,
  id,
  className,
}: {
  copy: { tag?: string | null; heading: HeadingValue }
  faqs: Faq[]
  number?: number
  id?: string
  className?: string
}) {
  if (!faqs.length) return null
  return (
    <section
      id={id}
      className={cn(
        'grid scroll-mt-5 grid-cols-1 gap-[25px] px-site py-section md:grid-cols-[1fr_1.2fr] md:gap-[8%]',
        className,
      )}
    >
      <div data-reveal>
        <Tag number={number}>{copy.tag}</Tag>
        <StyledHeading
          value={copy.heading}
          className="text-[40px] leading-[1.13] tracking-[-1.5px] md:text-h2"
        />
      </div>
      <FaqList faqs={faqs} />
    </section>
  )
}
