import Link from 'next/link'

import { SocialLinks } from '@/components/ui/SocialLinks'
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
        {location && <span className="label-sm text-text md:text-[14px]">{location}</span>}
        {settings.brandParagraph && (
          <p className="mt-[5px] text-[16px]">{settings.brandParagraph}</p>
        )}
      </div>

      {!!footer?.links?.length && (
        <ul className="col-span-2 flex flex-wrap gap-[22px] font-label text-[14px] md:col-span-1 md:flex-col md:gap-[9px] md:text-[14px]">
          {footer.links.map((link) => (
            <li key={link.id}>
              <Link href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <SocialLinks
        studioName={settings.studioName}
        links={settings.socialLinks}
        className="col-span-full"
      />

      <div className="col-span-full mt-3 flex flex-col gap-3 border-t border-line pt-5 text-[14px] text-faint md:flex-row md:items-center md:justify-between">
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
