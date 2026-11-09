/*
 * The site's URL map, in one place: rich-text links, SEO URLs, revalidation and preview paths all
 * read it, so a route only ever changes here.
 */

/** The page globals and the page each one edits. */
export const PAGE_GLOBALS = {
  homepage: '/',
  'about-page': '/about',
  'portfolio-page': '/portfolio',
  'visiting-page': '/visiting-albania',
  'journal-page': '/journal',
  'contact-page': '/contact',
} as const

export type PageGlobalSlug = keyof typeof PAGE_GLOBALS

export const pageGlobalSlugs = Object.keys(PAGE_GLOBALS) as PageGlobalSlug[]

/** The pages that list FAQs (each FAQ picks its pages in the CMS). */
export const faqPageOptions = [
  { label: 'Homepage', value: 'home' },
  { label: 'Contact', value: 'contact' },
  { label: 'Visiting Albania', value: 'visiting' },
] as const

export type FaqPage = (typeof faqPageOptions)[number]['value']

/** The enquiry form's anchor on the homepage and the contact page. */
export const ENQUIRY_ID = 'tattoo-enquiry'

/** A document's public URL, by collection. Artists have no page of their own: they live on About. */
export function pathForDoc(
  collection: string | undefined,
  slug: string | null | undefined,
): string {
  switch (collection) {
    case 'posts':
      return `/journal/${slug ?? ''}`
    case 'portfolio-items':
      return `/portfolio/${slug ?? ''}`
    case 'legal-pages':
      return `/${slug ?? ''}`
    case 'artists':
      return PAGE_GLOBALS['about-page']
    default:
      return '/'
  }
}
