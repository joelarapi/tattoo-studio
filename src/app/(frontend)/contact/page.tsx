import type { Metadata } from 'next'

import { FaqSection } from '@/components/faq/FaqSection'
import { ContactDetail, EnquirySection } from '@/components/forms/EnquirySection'
import { Notice, NumberedCards } from '@/components/ui/Blocks'
import { platformLabels } from '@/components/ui/SocialIcon'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines } from '@/components/ui/Text'
import { getContactPage, getFaqs, getPortfolioItems, getSiteSettings } from '@/lib/data'
import { openingHoursRows, telHref, whatsappHref } from '@/lib/format'
import { headingText } from '@/lib/heading'
import { pageMetadata } from '@/lib/metadata'
import { PAGE_GLOBALS } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getContactPage(), getSiteSettings()])
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: headingText(page.hero.heading),
    fallbackDescription: page.hero.intro,
    path: PAGE_GLOBALS['contact-page'],
  })
}

const linkClass = 'text-text underline decoration-[#666] underline-offset-4 hover:decoration-accent'

export default async function ContactPage() {
  const [page, settings, faqs, portfolio] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
    getFaqs('contact'),
    getPortfolioItems(),
  ])
  const { address } = settings
  const city = [address?.city, address?.country].filter(Boolean).join(', ')
  const hours = settings.openingHours?.length ? openingHoursRows(settings.openingHours) : []

  return (
    <main id="main">
      <EnquirySection
        tag={page.hero.tag}
        heading={page.hero.heading}
        headingAs="h1"
        intro={page.hero.intro}
        form={page.form}
        projects={portfolio.map(({ slug, title }) => ({ slug, title }))}
      >
        <ContactDetail label={page.hero.studioLabel} title={city}>
          {address?.street && (
            <p>
              {address.street}
              {address.postcode && `, ${address.postcode}`}
            </p>
          )}
          {settings.googleMapsUrl && (
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Open in Google Maps ↗&#xFE0E;
            </a>
          )}
          {hours.length > 0 && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4">
              {hours.map((row) => (
                <div key={row.days} className="contents">
                  <dt className="text-text">{row.days}</dt>
                  <dd>{row.hours}</dd>
                </div>
              ))}
            </dl>
          )}
        </ContactDetail>
        <ContactDetail label={page.hero.directLabel}>
          <ul className="flex flex-col gap-1">
            <li>
              <a href={telHref(settings.phone)} className={linkClass}>
                {settings.phone}
              </a>
            </li>
            {settings.whatsapp && (
              <li>
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${settings.email}`} className={linkClass}>
                {settings.email}
              </a>
            </li>
            {settings.socialLinks?.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {platformLabels[social.platform]}
                </a>
              </li>
            ))}
          </ul>
        </ContactDetail>
        {page.hero.notice && (
          <Notice className="mt-[30px]">
            <Lines text={page.hero.notice} />
          </Notice>
        )}
      </EnquirySection>

      {!!page.next.cards?.length && (
        <section className="border-t border-[#222] px-site py-section">
          <div data-reveal>
            <Tag>{page.next.tag}</Tag>
            <StyledHeading value={page.next.heading} className="text-h2" />
          </div>
          <NumberedCards cards={page.next.cards} className="mt-[35px]" />
        </section>
      )}

      <FaqSection copy={page.faq} faqs={faqs} />
    </main>
  )
}
