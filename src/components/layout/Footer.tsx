import Link from 'next/link'

import { SocialLinks } from '@/components/ui/SocialLinks'
import { pathForDoc } from '@/lib/routes'
import type { Navigation, SiteSetting } from '@/payload-types'

import { Wordmark } from './Wordmark'

type FooterLink = { label: string; href: string }
type FooterPage = { slug: string; title: string }

// These guides are standalone Next.js routes rather than Pages collection entries.
const travelGuides: FooterLink[] = [
  { label: 'From Italy', href: '/visiting-albania/from-italy' },
  { label: 'From Germany', href: '/visit/from-germany' },
  { label: 'From Poland', href: '/visit/from-poland' },
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

/**
 * One four-column desktop row: logo, two columns of pages, travel guides.
 * A single divider separates navigation from social and legal information.
 */
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

  // Preserve editor-curated links; automatically add any other published CMS pages.
  // Portfolio pieces and journal articles are intentionally excluded.
  const cmsLinks = footerPages.map((page) => ({
    label: pageLabels[page.slug] ?? page.title,
    href: pathForDoc('pages', page.slug),
  }))
  const allPageLinks = uniqueLinks([
    ...cmsLinks.filter((link) => pathname(link.href) === '/'),
    ...(footer?.links ?? []),
    ...[...cmsLinks].sort((a, b) => a.label.localeCompare(b.label)),
  ])
  const pageLinks = allPageLinks.filter((link) => !legalPaths.has(pathname(link.href)))
  const legalLinks = uniqueLinks([
    ...(footer?.legalLinks ?? []),
    ...cmsLinks.filter((link) => legalPaths.has(pathname(link.href))),
  ])

  return (
    // Leave space on phones for the homepage's pinned enquiry button.
    <footer className="px-site pt-[45px] pb-[25px] in-[body:has([data-mobile-cta])]:pb-[100px] md:pt-[55px] md:pb-7 md:in-[body:has([data-mobile-cta])]:pb-7">
      <div className="grid items-start gap-x-10 gap-y-10 lg:grid-cols-[minmax(220px,1.2fr)_minmax(0,3fr)] lg:gap-x-[65px]">
        <Wordmark settings={settings} />

        <nav aria-label="Footer" className="grid grid-cols-1 gap-x-9 gap-y-9 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <h2 className="font-label text-[12px] tracking-[0.12em] text-faint uppercase">
              Pages
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-7 gap-y-3">
              {pageLinks.map((link) => (
                <li key={pathname(link.href)}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-label text-[12px] tracking-[0.12em] text-faint uppercase">
              Travel guides
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {travelGuides.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-[45px] flex flex-col gap-5 border-t border-line pt-5 text-[14px] text-faint lg:flex-row lg:items-center lg:justify-between lg:gap-x-8">
        <p>© {year} {settings.studioName}</p>
        <SocialLinks
          studioName={settings.studioName}
          links={settings.socialLinks}
        />
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
