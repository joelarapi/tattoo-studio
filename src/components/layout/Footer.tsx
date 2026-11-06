import Link from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { platformLabels, SocialIcon } from '@/components/ui/SocialIcon'
import { openingHoursRows, telHref, whatsappHref } from '@/lib/format'
import type { Navigation, SiteSetting, Style } from '@/payload-types'

import { NewsletterForm } from './NewsletterForm'

type FooterProps = {
  navigation: Navigation
  settings: SiteSetting
  styles: Pick<Style, 'id' | 'name' | 'slug'>[]
}

const linkClass = 'text-text-muted transition-colors duration-300 hover:text-text'

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="mono-label-sm text-text">{title}</h2>
      {children}
    </div>
  )
}

export function Footer({ navigation, settings, styles }: FooterProps) {
  const footer = navigation.footer
  const { address } = settings
  const year = new Date().getFullYear()

  return (
    <footer className="px-site-margin pt-section pb-6">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-gutter lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        {/* Brand panel with the notched corner */}
        <div className="flex flex-col justify-between gap-10 rounded-md bg-surface p-8 [clip-path:polygon(0_0,calc(100%-2.5rem)_0,100%_2.5rem,100%_100%,0_100%)]">
          <div className="flex flex-col gap-6">
            <Logo name={settings.studioName} logo={settings.logo} />
            {settings.brandParagraph && <p className="max-w-[40ch]">{settings.brandParagraph}</p>}
          </div>
          {!!settings.socialLinks?.length && (
            <ul className="flex flex-wrap gap-2">
              {settings.socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.studioName} on ${platformLabels[social.platform]}`}
                    className="grid size-10 place-items-center rounded-sm bg-surface-2 text-text transition-colors hover:bg-muted"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 rounded-md bg-surface p-8 sm:grid-cols-2 xl:grid-cols-[auto_auto_minmax(0,1.5fr)_minmax(0,1.1fr)]">
          {(footer?.columns ?? []).map((column) => (
            <Column key={column.id} title={column.title}>
              <ul className="flex flex-col gap-2.5">
                {column.type === 'styles'
                  ? styles.map((style) => (
                      <li key={style.id}>
                        <Link href={`/styles/${style.slug}`} className={linkClass}>
                          {style.name}
                        </Link>
                      </li>
                    ))
                  : (column.links ?? []).map((link) => (
                      <li key={link.id}>
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
              </ul>
            </Column>
          ))}

          {footer?.newsletter && (
            <Column title={footer.newsletter.title}>
              {footer.newsletter.text && <p className="max-w-[36ch]">{footer.newsletter.text}</p>}
              <NewsletterForm
                buttonLabel={footer.newsletter.buttonLabel}
                consentLabel={footer.newsletter.consentLabel}
              />
            </Column>
          )}

          <Column title={footer?.contactTitle || 'Contact'}>
            <address className="flex flex-col gap-4 not-italic">
              <p>
                {address.street}
                <br />
                {[address.postcode, address.city].filter(Boolean).join(' ')}, {address.country}
                {settings.googleMapsUrl && (
                  <>
                    <br />
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-text underline decoration-muted underline-offset-4 hover:decoration-text"
                    >
                      Open in Google Maps
                    </a>
                  </>
                )}
              </p>
              <p className="flex flex-col gap-1">
                <a href={telHref(settings.phone)} className={linkClass}>
                  {settings.phone}
                </a>
                {settings.whatsapp && (
                  <a
                    href={whatsappHref(settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    WhatsApp
                  </a>
                )}
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              </p>
            </address>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {openingHoursRows(settings.openingHours).map((row) => (
                <div key={row.days} className="contents">
                  <dt className="text-text">{row.days}</dt>
                  <dd className="whitespace-nowrap">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </Column>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-site flex-col gap-3 mono-label-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {(footer?.legalLine || `© {year} ${settings.studioName}`).replace('{year}', String(year))}
        </p>
        {!!footer?.legalLinks?.length && (
          <ul className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
