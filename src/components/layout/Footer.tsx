import Link from 'next/link'

import { platformLabels, SocialIcon } from '@/components/ui/SocialIcon'
import type { Navigation, SiteSetting } from '@/payload-types'

import { Wordmark } from './Wordmark'

/** Wordmark, city and tagline, the page links, social profiles and the legal line. */
export function Footer({
  navigation,
  settings,
}: {
  navigation: Navigation
  settings: SiteSetting
}) {
  const footer = navigation.footer
  const year = new Date().getFullYear()
  const location = [settings.address?.city, settings.address?.country].filter(Boolean).join(', ')

  return (
    // On phones, leave room under the footer for the homepage's pinned enquiry button.
    <footer className="grid grid-cols-2 gap-[30px] px-site pt-[45px] pb-[25px] in-[body:has([data-mobile-cta])]:pb-[100px] md:grid-cols-3 md:pt-[55px] md:pb-7 md:in-[body:has([data-mobile-cta])]:pb-7">
      <Wordmark settings={settings} />
      <div>
        {location && <span className="label-sm text-text md:text-[10px]">{location}</span>}
        {settings.brandParagraph && (
          <p className="mt-[5px] text-[12px]">{settings.brandParagraph}</p>
        )}
      </div>

      {!!footer?.links?.length && (
        <ul className="col-span-2 flex flex-wrap gap-[22px] font-label text-[10px] md:col-span-1 md:flex-col md:gap-[9px] md:text-[11px]">
          {footer.links.map((link) => (
            <li key={link.id}>
              <Link href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!!settings.socialLinks?.length && (
        <ul className="col-span-full flex items-center gap-3">
          {settings.socialLinks.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings.studioName} on ${platformLabels[social.platform]}`}
                className="grid size-[42px] place-items-center rounded-[5px] border border-[#3b3b3b] bg-panel text-[#deddd8] transition-colors hover:border-accent hover:text-accent"
              >
                <SocialIcon platform={social.platform} />
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="col-span-full mt-3 flex flex-col gap-3 border-t border-line pt-5 text-[9px] text-faint md:flex-row md:items-center md:justify-between">
        <p>
          {(footer?.legalLine || `© {year} ${settings.studioName}`).replace('{year}', String(year))}
        </p>
        {!!footer?.legalLinks?.length && (
          <ul className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="underline underline-offset-2 hover:text-text">
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
