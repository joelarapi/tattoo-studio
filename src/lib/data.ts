import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { CollectionSlug, GlobalSlug, Where } from 'payload'

import { collectionTag, globalTag } from './cache-tags'
import { getPayloadClient } from './payload'
import type { FaqPage, PageGlobalSlug } from './routes'

/*
 * CMS reads for the frontend. Published content is cached and tagged with every collection and
 * global it touches (see cache-tags.ts), so the revalidation hooks refresh it within seconds of a
 * publish. In draft mode (CMS preview) the cache is skipped and drafts are read instead.
 *
 * `unstable_cache` rather than `'use cache'`: the latter needs Next's Cache Components mode,
 * which changes how every route renders, Payload's admin included.
 */

type Tags = { collections?: CollectionSlug[]; globals?: GlobalSlug[] }

async function isDraft(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (e.g. generateStaticParams): never draft.
    return false
  }
}

function cmsQuery<Args extends unknown[], T>(
  key: string,
  { collections = [], globals = [] }: Tags,
  load: (draft: boolean, ...args: Args) => Promise<T>,
) {
  const tags = [...collections.map(collectionTag), ...globals.map(globalTag)]
  const cached = unstable_cache((...args: Args) => load(false, ...args), [key], { tags })
  return async (...args: Args): Promise<T> =>
    (await isDraft()) ? load(true, ...args) : cached(...args)
}

/** Only published posts outside draft mode (the Local API skips access control). */
const publishedOnly = (draft: boolean): Where => (draft ? {} : { _status: { equals: 'published' } })

// Rich text can link to these, so readers of rich text are tagged with them too.
const linkable: CollectionSlug[] = ['posts', 'portfolio-items', 'legal-pages']

/* ---------- Globals ---------- */

// Every page global has a share image (media) in its SEO tab.
function pageGlobal<S extends PageGlobalSlug>(slug: S, collections: CollectionSlug[], depth = 1) {
  return cmsQuery(
    slug,
    { globals: [slug], collections: ['media', ...collections] },
    async (draft) => (await getPayloadClient()).findGlobal({ slug, depth, draft }),
  )
}

export const getHomepage = pageGlobal('homepage', ['artists'], 2)
export const getAboutPage = pageGlobal('about-page', ['artists'], 2)
export const getPortfolioPage = pageGlobal('portfolio-page', linkable)
export const getVisitingPage = pageGlobal('visiting-page', linkable)
export const getJournalPage = pageGlobal('journal-page', ['posts'])
export const getContactPage = pageGlobal('contact-page', linkable)

export const getSiteSettings = cmsQuery(
  'site-settings',
  { globals: ['site-settings'], collections: ['media'] },
  async (draft) =>
    (await getPayloadClient()).findGlobal({ slug: 'site-settings', depth: 1, draft }),
)

export const getNavigation = cmsQuery('navigation', { globals: ['navigation'] }, async (draft) =>
  (await getPayloadClient()).findGlobal({ slug: 'navigation', depth: 0, draft }),
)

/* ---------- Portfolio ---------- */

/** Portfolio categories in CMS order (the filter buttons). */
export const getStyles = cmsQuery('styles', { collections: ['styles'] }, async (draft) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'styles',
    sort: '_order',
    depth: 0,
    limit: 50,
    pagination: false,
    draft,
  })
  return docs
})

/** Every portfolio piece in CMS order, with category, images and artist. */
export const getPortfolioItems = cmsQuery(
  'portfolio-items',
  { collections: ['portfolio-items', 'styles', 'media', 'artists'] },
  async (draft) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'portfolio-items',
      sort: '_order',
      depth: 1,
      limit: 200,
      pagination: false,
      draft,
    })
    return docs
  },
)

/* ---------- Journal ---------- */

const postListSelect = {
  title: true,
  slug: true,
  excerpt: true,
  cover: true,
  categories: true,
  publishedAt: true,
  _status: true,
} as const

/** Every published post, newest first, without its body. */
export const getPosts = cmsQuery(
  'posts',
  { collections: ['posts', 'categories', 'media'] },
  async (draft) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: publishedOnly(draft),
      sort: '-publishedAt',
      select: postListSelect,
      depth: 1,
      limit: 200,
      pagination: false,
      draft,
    })
    return docs
  },
)

export const getLatestPosts = cmsQuery(
  'latest-posts',
  { collections: ['posts', 'categories', 'media'] },
  async (draft, limit: number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: publishedOnly(draft),
      sort: '-publishedAt',
      select: postListSelect,
      depth: 1,
      limit,
      draft,
    })
    return docs
  },
)

export const getPost = cmsQuery(
  'post',
  { collections: ['posts', 'categories', 'media', 'artists', ...linkable] },
  async (draft, slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, publishedOnly(draft)] },
      depth: 1,
      limit: 1,
      draft,
    })
    return docs[0] ?? null
  },
)

/* ---------- FAQs and legal pages ---------- */

export const getFaqs = cmsQuery(
  'faqs',
  { collections: ['faqs', ...linkable] },
  async (draft, page: FaqPage) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'faqs',
      where: { pages: { in: [page] } },
      sort: '_order',
      depth: 1,
      limit: 20,
      draft,
    })
    return docs
  },
)

export const getLegalPageSlugs = cmsQuery(
  'legal-page-slugs',
  { collections: ['legal-pages'] },
  async (draft) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'legal-pages',
      select: { slug: true },
      depth: 0,
      limit: 50,
      pagination: false,
      draft,
    })
    return docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug))
  },
)

export const getLegalPage = cmsQuery(
  'legal-page',
  { collections: linkable },
  async (draft, slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'legal-pages',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
      draft,
    })
    return docs[0] ?? null
  },
)
