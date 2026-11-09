import { seoPlugin } from '@payloadcms/plugin-seo'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import type { PayloadRequest } from 'payload'

import { layoutSummary } from '@/blocks/summary'
import { seoFields } from '@/fields/seo'
import { getServerURL } from '@/lib/preview'
import { richTextToPlainText, truncate } from '@/lib/richtext'
import { HOME_SLUG, pathForDoc } from '@/lib/routes'

/*
 * Powers the "Auto-generate" buttons in every SEO tab. Collections place the fields themselves
 * (src/fields/seo.ts, `seoTab()`), so the plugin adds none of its own.
 */

type Relation = number | string | { id: number | string } | null | undefined
type AnyDoc = Record<string, unknown> & {
  slug?: string
  title?: string
  name?: string
  excerpt?: string
  summary?: string
  bio?: unknown
  cover?: Relation
  portrait?: Relation
  images?: Relation[]
  videoPoster?: Relation
  layout?: unknown
}

const relationID = (value: Relation) =>
  value && typeof value === 'object' ? value.id : (value ?? undefined)

async function getSiteSettings(req: PayloadRequest) {
  return req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
}

const isPage = (collection: string | undefined) => collection === 'pages'

const generateTitle: GenerateTitle<AnyDoc> = async ({ doc, collectionConfig, req }) => {
  const settings = await getSiteSettings(req)
  const studioName = settings.studioName || ''
  const page = isPage(collectionConfig?.slug) ? layoutSummary(doc.layout) : null
  if (page && doc.slug === HOME_SLUG) {
    // Lead with the studio name, as Google expects for brand searches.
    return [studioName, page.heading].filter(Boolean).join(' | ')
  }
  const pageTitle = page?.heading || doc.title || doc.name || ''
  const template = settings.seo?.titleTemplate || `%s | ${studioName}`
  return template.replace('%s', pageTitle)
}

const generateDescription: GenerateDescription<AnyDoc> = ({ doc, collectionConfig }) => {
  const collection = collectionConfig?.slug
  const text =
    collection === 'posts'
      ? doc.excerpt
      : collection === 'portfolio-items'
        ? doc.summary
        : collection === 'artists'
          ? richTextToPlainText(doc.bio)
          : layoutSummary(doc.layout).intro
  return truncate((text || '').replace(/\s+/g, ' ').trim(), 155)
}

const generateURL: GenerateURL<AnyDoc> = ({ doc, collectionConfig }) =>
  `${getServerURL()}${pathForDoc(collectionConfig?.slug, doc.slug)}`

const generateImage: GenerateImage<AnyDoc> = async ({ doc, collectionConfig, req }) => {
  const own = isPage(collectionConfig?.slug)
    ? relationID(layoutSummary(doc.layout).image)
    : relationID(doc.cover ?? doc.portrait ?? doc.images?.[0] ?? doc.videoPoster)
  if (own) return own
  if (!isPage(collectionConfig?.slug)) return ''
  const settings = await getSiteSettings(req)
  return relationID(settings.seo?.ogImage) ?? ''
}

export const seo = seoPlugin({
  tabbedUI: true,
  uploadsCollection: 'media',
  fields: () => seoFields(),
  generateTitle,
  generateDescription,
  generateURL,
  generateImage,
})
