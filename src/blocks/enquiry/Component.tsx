import type { ReactNode } from 'react'

import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { RichText } from '@/components/RichText'
import { Action } from '@/components/ui/Action'
import { Notice } from '@/components/ui/Blocks'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { getPortfolioItems, getSiteSettings } from '@/lib/data'
import { openingHoursRows, telHref, whatsappHref } from '@/lib/format'
import { ENQUIRY_ID } from '@/lib/routes'
import type { SiteSetting } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

type Data = { settings: SiteSetting; projects: { slug?: string | null; title: string }[] }

/** Studio details for the side text, and the pieces "?project=<slug>" links can name. */
export async function loadEnquiry(): Promise<Data> {
  const [settings, items] = await Promise.all([getSiteSettings(), getPortfolioItems()])
  return { settings, projects: items.map(({ slug, title }) => ({ slug, title })) }
}

const linkClass =
  'text-text underline decoration-[#666] underline-offset-4 [overflow-wrap:anywhere] hover:decoration-accent'

/** A labelled block of details under the enquiry copy ("The studio", "Direct contact"). */
function ContactDetail({
  label,
  title,
  children,
}: {
  label?: string | null
  title?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mt-[25px] border-t border-line pt-[25px]">
      {label && <span className="tag mb-2.5">{label}</span>}
      {title && <h3 className="text-h3">{title}</h3>}
      {children && <div className="mt-3 text-[16px] leading-[1.8]">{children}</div>}
    </div>
  )
}

/** Address, opening hours, phone, email and social links from Studio details. */
function StudioDetails({
  settings,
  studioLabel,
  directLabel,
  notice,
}: {
  settings: SiteSetting
  studioLabel?: string | null
  directLabel?: string | null
  notice?: string | null
}) {
  const { address } = settings
  const city = [address?.city, address?.country].filter(Boolean).join(', ')
  const hours = settings.openingHours?.length ? openingHoursRows(settings.openingHours) : []
  return (
    <>
      <ContactDetail label={studioLabel} title={city}>
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
      <ContactDetail label={directLabel}>
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
        </ul>
        <SocialLinks
          studioName={settings.studioName}
          links={settings.socialLinks}
          className="mt-4"
        />
      </ContactDetail>
      {notice && (
        <Notice className="mt-[30px]">
          <Lines text={notice} />
        </Notice>
      )}
    </>
  )
}

/** Copy and studio details on the left, the enquiry form (Studio details → Enquiry form) right. */
export function Enquiry({ block, data, ctx }: BlockProps<'enquiry', Data>) {
  const { settings, projects } = data
  const form = settings.enquiryForm
  const location = [settings.address?.city, settings.address?.country].filter(Boolean).join(', ')
  return (
    <BlockSection
      block={block}
      id={ENQUIRY_ID}
      className="grid grid-cols-1 items-start gap-[35px] px-site py-section md:grid-cols-[1fr_1.4fr] md:gap-[5%] lg:gap-[9%]"
    >
      <div data-reveal>
        <Tag number={ctx.number}>{block.tag}</Tag>
        <StyledHeading
          as={ctx.headingAs}
          value={block.heading}
          className="text-[49px] leading-[1.13] tracking-[-1.5px] md:text-[clamp(42px,4.7vw,70px)] md:tracking-[-2.4px]"
        />
        <Paragraphs text={block.intro} className="mt-[23px] text-[16px]" />
        {block.side === 'details' ? (
          <StudioDetails
            settings={settings}
            studioLabel={block.studioLabel}
            directLabel={block.directLabel}
            notice={block.notice}
          />
        ) : (
          <>
            <ContactDetail label={settings.studioName} title={location && `${location}.`}>
              <Paragraphs text={block.detailText} />
            </ContactDetail>
            <Action link={block.contactLink} variant="plain" className="mt-[30px]" />
          </>
        )}
      </div>
      <EnquiryForm
        copy={form}
        projects={projects}
        privacyNote={form.privacyNote ? <RichText data={form.privacyNote} /> : undefined}
      />
    </BlockSection>
  )
}
