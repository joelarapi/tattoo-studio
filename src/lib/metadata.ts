import type { Metadata } from 'next'

import type { Media, SiteSetting } from '@/payload-types'

type Meta =
  | {
      title?: string | null
      description?: string | null
      image?: number | Media | null
    }
  | null
  | undefined

const media = (value: number | Media | null | undefined) =>
  value && typeof value === 'object' ? value : null

type PageMetadataArgs = {
  settings: SiteSetting
  /** The SEO tab of the page or document. `meta.title` is the full title, used as-is. */
  meta?: Meta
  /** Used with the title template when the SEO title is empty, e.g. the post title. */
  fallbackTitle?: string
  fallbackDescription?: string | null
  /** The page's own image (post cover, portfolio photo) when the SEO tab has none. */
  image?: number | Media | null
  path: string
  type?: 'website' | 'article'
}

/**
 * Title, description, canonical URL and share card for a page, from its SEO tab with fallbacks to
 * Studio details → SEO defaults.
 */
export function pageMetadata({
  settings,
  meta,
  fallbackTitle,
  fallbackDescription,
  image,
  path,
  type = 'website',
}: PageMetadataArgs): Metadata {
  const template = settings.seo?.titleTemplate || `%s | ${settings.studioName}`
  const title =
    meta?.title || (fallbackTitle ? template.replace('%s', fallbackTitle) : settings.studioName)
  const description = meta?.description || fallbackDescription || settings.seo?.description
  const share = media(meta?.image) ?? media(image) ?? media(settings.seo?.ogImage)
  const shareURL = share?.sizes?.og?.url ?? share?.url
  const images = shareURL
    ? [{ url: shareURL, width: 1200, height: 630, alt: share?.alt ?? '' }]
    : undefined

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description: description ?? undefined,
      url: path,
      siteName: settings.studioName,
      locale: 'en_GB',
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description: description ?? undefined,
      images: images?.map((i) => i.url),
    },
  }
}
