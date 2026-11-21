import Link from 'next/link'

import { SocialLinks } from '@/components/ui/SocialLinks'
import { pathForDoc } from '@/lib/routes'
import type { Navigation, SiteSetting } from '@/payload-types'

import { Wordmark } from './Wordmark'

type FooterLink = { label: string; href: string }
type FooterPage = { slug: string; title: string }

// These pages have their own Next.js routes rather than entries in the Pages collection.
// Keep this list aligned with the standalone routes in src/app/(frontend)/ and sitemap.ts.
const travelGuides: FooterLink[] = [
  { label: 'From Italy', href: '/visiting-albania/from-italy' },
  { label: 'From Germany', href: '/visit/from-germany' },
  { label: 'From Poland', href: '/visit/from-poland' },
]

const serviceGuides: FooterLink[] = [
  { label: 'Geometric tattoos', href: '/services/geometric-tattoo' },
]

const legalPaths = new Set(['/privacy', '/privacy-policy', '/cookies', '/terms', '/terms-of-service'])

const pageLabels: Record<string, string> = {
  home: 'Home',
  about: 'About us',
  journal: 'Blog',
  'visiting-albania': 'Visiting Albania',
  contact: 'Contact',
}

function pathname(href: string): string {
  const withoutParams = href.split(/[?#]/)[0]
  return withoutParams.replace(/\/+$/, '') || '/'
}

function isDetailPage(href: string): boolean {
  const path = pathname(href)
  return path.startsWith('/portfolio/') || path.startsWith('/journal/')
}

function uniqueLinks(links: FooterLink[]): FooterLink[] {
  const visited = new Set<string>()
  return links.filter((link) => {
    if (isDetailPage(link.href)) return false
    const path = pathname(link.href)
    if (visited.has(path)) return false
    visited.add(path)
    return true
  })
}

/** Wordmark, site pages, standalone guides, social profiles and the legal line. */
export function Footer({
  navigation,
  settings,
  footerPages,
}: {
  navigation: Navigation
  settings: SiteSetting
  footerPages: FooterPage[]
}) {
  const footer = navigation.footer
  const year = new Date().getFullYear()
  const location = [settings.address?.city, settings.address?.country].filter(Boolean).join(', ')

  // Keep editor-curated link labels/order, then add any other published CMS pages.
  // Individual portfolio and journal entries never appear in this list.
  const cmsLinks = footerPages.map((page) => ({
    label: pageLabels[page.slug] ?? page.title,
    href: pathForDoc('pages', page.slug),
  }))
  const allPageLinks = uniqueLinks([
    ...cmsLinks.filter((link) => pathname(link.href) === '/'),
    ...(footer?.links ?? []),
    ...cmsLinks.toSorted((a, b) => a.label.localeCompare(b.label)),
  ])
  const pageLinks = allPageLinks.filter((link) => !legalPaths.has(pathname(link.href)))
  const legalLinks = uniqueLinks([
    ...(footer?.legalLinks ?? []),
    ...cmsLinks.filter((link) => legalPaths.has(pathname(link.href))),
  ])

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

      <nav aria-label="Footer" className="col-span-full grid grid-cols-1 gap-x-10 gap-y-8 border-t border-line pt-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <h2 className="font-label text-[12px] tracking-[0.12em] text-faint uppercase">Pages</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
            {pageLinks.map((link) => (
              <li key={pathname(link.href)}>
                <Link href={link.href} className="text-[14px] transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-label text-[12px] tracking-[0.12em] text-faint uppercase">Tattoo services</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {serviceGuides.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[14px] transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-label text-[12px] tracking-[0.12em] text-faint uppercase">Travel guides</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {travelGuides.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[14px] transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <SocialLinks
        studioName={settings.studioName}
        links={settings.socialLinks}
        className="col-span-full"
      />

      <div className="col-span-full mt-3 flex flex-col gap-3 border-t border-line pt-5 text-[14px] text-faint md:flex-row md:items-center md:justify-between">
        <p>
          {(footer?.legalLine || `© {year} ${settings.studioName}`).replace('{year}', String(year))}
        </p>
        {legalLinks.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={pathname(link.href)}>
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
