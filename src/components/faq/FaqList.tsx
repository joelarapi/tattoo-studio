import { RichText } from '@/components/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { cn } from '@/lib/cn'
import { richTextToPlainText } from '@/lib/richtext'
import type { Faq } from '@/payload-types'

/**
 * Questions as native <details> (open and close without JS) with a +/− marker, plus FAQPage
 * structured data so Google can show them in results.
 */
export function FaqList({
  faqs,
  className,
  structuredData = true,
}: {
  faqs: Faq[]
  className?: string
  /** Only one FAQPage block per page: turn off for repeats. */
  structuredData?: boolean
}) {
  if (!faqs.length) return null
  return (
    <div className={className}>
      {faqs.map((faq) => (
        <details key={faq.id} data-reveal className="group border-b border-line-strong">
          <summary className="relative cursor-pointer py-[22px] pr-7 text-[13px] text-text md:text-[14px]">
            {faq.question}
            <span
              aria-hidden="true"
              className="absolute top-[15px] right-0 text-[20px] text-accent group-open:hidden"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="absolute top-[15px] right-0 hidden text-[20px] text-accent group-open:inline"
            >
              −
            </span>
          </summary>
          <RichText
            data={faq.answer}
            className={cn(
              'mb-[22px] text-[12px] leading-[1.85] md:text-[13px]',
              '[&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-3',
            )}
          />
        </details>
      ))}
      {structuredData && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: richTextToPlainText(faq.answer) },
            })),
          }}
        />
      )}
    </div>
  )
}
