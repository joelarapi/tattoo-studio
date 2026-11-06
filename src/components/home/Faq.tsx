import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { JsonLd } from '@/components/seo/JsonLd'
import { richTextToPlainText } from '@/lib/richtext'
import type { Faq as FaqDoc, Homepage } from '@/payload-types'

type FaqProps = {
  copy: Homepage['faq']
  faqs: FaqDoc[]
}

/**
 * Native <details> disclosures: keyboard accessible, work without JS, and their answers stay in
 * the HTML for Google. Also outputs FAQPage structured data.
 */
export function Faq({ copy, faqs }: FaqProps) {
  if (faqs.length === 0) return null
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-section-lg">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <SectionHeading
          id="faq-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start"
        />
        <ul className="border-t border-surface-2">
          {faqs.map((faq) => (
            <li key={faq.id} className="border-b border-surface-2">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-large text-text">
                  <h3 className="leading-snug text-[inherit]">{faq.question}</h3>
                  <span
                    aria-hidden="true"
                    className="relative size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                  />
                </summary>
                <RichText
                  data={faq.answer}
                  className="max-w-[62ch] pb-7 [&_a]:text-text [&_a]:underline [&_p+p]:mt-3"
                />
              </details>
            </li>
          ))}
        </ul>
      </Container>
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
    </section>
  )
}
