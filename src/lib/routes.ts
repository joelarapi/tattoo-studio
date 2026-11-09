/*
 * The site's URL map, in one place: rich-text links, SEO URLs, revalidation and preview paths all
 * read it, so a route only ever changes here.
 */

/** The page served at `/`. */
export const HOME_SLUG = 'home'

/**
 * Pages the site's structure depends on: `/`, and the parents of the portfolio-piece and
 * journal-article pages. They can't be deleted, and their slug can't change.
 */
export const SYSTEM_PAGE_SLUGS = [HOME_SLUG, 'portfolio', 'journal']

/** Slugs a page can't take: the site's own routes. */
export const RESERVED_PAGE_SLUGS = ['admin', 'api', 'next', '_next', 'lp']

/** The enquiry form's anchor (the enquiry block always has it). */
export const ENQUIRY_ID = 'tattoo-enquiry'

/** A document's public URL, by collection. Artists have no page of their own: they live on About. */
export function pathForDoc(
  collection: string | undefined,
  slug: string | null | undefined,
): string {
  switch (collection) {
    case 'pages':
      return !slug || slug === HOME_SLUG ? '/' : `/${slug}`
    case 'posts':
      return `/journal/${slug ?? ''}`
    case 'portfolio-items':
      return `/portfolio/${slug ?? ''}`
    case 'artists':
      return '/about'
    default:
      return '/'
  }
}
