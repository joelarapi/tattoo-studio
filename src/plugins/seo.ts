import { seoPlugin } from '@payloadcms/plugin-seo'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import type { PayloadRequest } from 'payload'

import { seoFields } from '@/fields/seo'
import { getServerURL } from '@/lib/preview'
import { richTextToPlainText, truncate } from '@/lib/richtext'

/*
 * Powers the "Auto-generate" buttons in every SEO tab. Collections place the fields themselves
 * (src/fields/seo.ts); the homepage global gets them from the plugin, which the plugin requires
 * for globals.
 */

type Relation = number | string | { id: number | string } | null | undefined
type AnyDoc = Record<string, unknown> & {
  slug?: string
  title?: string
  name?: string
  excerpt?: string
  shortDescription?: string
  bio?: unknown
  cover?: Relation
  portrait?: Relation
  heroImage?: Relation
  hero?: { heading?: string; intro?: string; eyebrow?: string }
}

const relationID = (value: Relation) =>
  value && typeof value === 'object' ? value.id : (value ?? undefined)

async function getSiteSettings(req: PayloadRequest) {
  return req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
}

const pathFor = (collection: string | undefined, doc: AnyDoc): string => {
  switch (collection) {
    case 'posts':
      return `/journal/${doc.slug ?? ''}`
    case 'artists':
      return `/artists/${doc.slug ?? ''}`
    case 'styles':
      return `/styles/${doc.slug ?? ''}`
    default:
      return '/'
  }
}

const generateTitle: GenerateTitle<AnyDoc> = async ({ doc, collectionConfig, req }) => {
  const settings = await getSiteSettings(req)
  const studioName = settings.studioName || ''
  if (!collectionConfig) {
    // Homepage: lead with the studio name, as Google expects for brand searches.
    return [studioName, doc.hero?.eyebrow].filter(Boolean).join(' | ')
  }
  const pageTitle = doc.title || doc.name || ''
  const template = settings.seo?.titleTemplate || `%s | ${studioName}`
  return template.replace('%s', pageTitle)
}

const generateDescription: GenerateDescription<AnyDoc> = ({ doc, collectionConfig }) => {
  const text =
    collectionConfig?.slug === 'posts'
      ? doc.excerpt
      : collectionConfig?.slug === 'styles'
        ? doc.shortDescription
        : collectionConfig?.slug === 'artists'
          ? richTextToPlainText(doc.bio)
          : doc.hero?.intro
  return truncate(text || '', 155)
}

const generateURL: GenerateURL<AnyDoc> = ({ doc, collectionConfig }) =>
  `${getServerURL()}${pathFor(collectionConfig?.slug, doc)}`

const generateImage: GenerateImage<AnyDoc> = async ({ doc, collectionConfig, req }) => {
  const own = relationID(doc.cover ?? doc.portrait ?? doc.heroImage)
  if (own) return own
  if (collectionConfig) return ''
  const settings = await getSiteSettings(req)
  return relationID(settings.seo?.ogImage) ?? ''
}

export const seo = seoPlugin({
  globals: ['homepage'],
  tabbedUI: true,
  uploadsCollection: 'media',
  fields: () => seoFields(),
  generateTitle,
  generateDescription,
  generateURL,
  generateImage,
})
