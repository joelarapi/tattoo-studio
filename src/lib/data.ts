import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { CollectionSlug, GlobalSlug } from 'payload'

import { collectionTag, globalTag } from './cache-tags'
import { getPayloadClient } from './payload'

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

export const getHomepage = cmsQuery(
  'homepage',
  { globals: ['homepage'], collections: ['media'] },
  async (draft) => (await getPayloadClient()).findGlobal({ slug: 'homepage', depth: 1, draft }),
)

export const getSiteSettings = cmsQuery(
  'site-settings',
  { globals: ['site-settings'], collections: ['media'] },
  async (draft) =>
    (await getPayloadClient()).findGlobal({ slug: 'site-settings', depth: 1, draft }),
)

export const getNavigation = cmsQuery('navigation', { globals: ['navigation'] }, async (draft) =>
  (await getPayloadClient()).findGlobal({ slug: 'navigation', depth: 0, draft }),
)

/** All styles in CMS order (menu, footer, booking form). */
export const getStyles = cmsQuery(
  'styles',
  { collections: ['styles', 'media'] },
  async (draft) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'styles',
        sort: '_order',
        depth: 0,
        limit: 50,
        pagination: false,
        draft,
      })
    ).docs,
)

export const getFeaturedStyles = cmsQuery(
  'featured-styles',
  { collections: ['styles'] },
  async (draft) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'styles',
        where: { featured: { equals: true } },
        sort: '_order',
        depth: 0,
        limit: 4,
        draft,
      })
    ).docs,
)

export const getArtists = cmsQuery(
  'artists',
  { collections: ['artists', 'styles', 'media'] },
  async (draft) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'artists',
        sort: '_order',
        depth: 1,
        limit: 50,
        pagination: false,
        draft,
      })
    ).docs,
)

export const getFeaturedWork = cmsQuery(
  'featured-work',
  { collections: ['portfolio-items', 'artists', 'styles', 'media'] },
  async (draft) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'portfolio-items',
        where: { featured: { equals: true } },
        sort: '_order',
        depth: 1,
        limit: 12,
        draft,
      })
    ).docs,
)

export const getHomepageFaqs = cmsQuery(
  'homepage-faqs',
  { collections: ['faqs'] },
  async (draft) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'faqs',
        where: { showOnHomepage: { equals: true } },
        sort: '_order',
        depth: 0,
        limit: 8,
        draft,
      })
    ).docs,
)

export const getLatestPosts = cmsQuery(
  'latest-posts',
  { collections: ['posts', 'categories', 'media'] },
  async (draft, limit: number) =>
    (
      await (
        await getPayloadClient()
      ).find({
        collection: 'posts',
        where: draft ? {} : { _status: { equals: 'published' } },
        sort: '-publishedAt',
        depth: 1,
        limit,
        draft,
      })
    ).docs,
)
