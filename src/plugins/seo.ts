import { seoPlugin } from '@payloadcms/plugin-seo'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import type { PayloadRequest } from 'payload'

import { seoFields } from '@/fields/seo'
import { headingText } from '@/lib/heading'
import { getServerURL } from '@/lib/preview'
import { richTextToPlainText, truncate } from '@/lib/richtext'
import { PAGE_GLOBALS, type PageGlobalSlug, pageGlobalSlugs, pathForDoc } from '@/lib/routes'

/*
 * Powers the "Auto-generate" buttons in every SEO tab. Collections place the fields themselves
 * (src/fields/seo.ts); the page globals get them from the plugin, which the plugin requires for
 * globals.
 */

type Relation = number | string | { id: number | string } | null | undefined
type Heading = { text?: string | null; soft?: string | null; accent?: string | null }
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
  hero?: { heading?: Heading; intro?: string; label?: string }
}

const relationID = (value: Relation) =>
  value && typeof value === 'object' ? value.id : (value ?? undefined)

const isPageGlobal = (slug: string | undefined): slug is PageGlobalSlug =>
  pageGlobalSlugs.includes(slug as PageGlobalSlug)

async function getSiteSettings(req: PayloadRequest) {
  return req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
}

const pathFor = (slug: string | undefined, doc: AnyDoc): string =>
  isPageGlobal(slug) ? PAGE_GLOBALS[slug] : pathForDoc(slug, doc.slug)

const generateTitle: GenerateTitle<AnyDoc> = async ({
  doc,
  collectionConfig,
  globalConfig,
  req,
}) => {
  const settings = await getSiteSettings(req)
  const studioName = settings.studioName || ''
  if (globalConfig?.slug === 'homepage') {
    // Lead with the studio name, as Google expects for brand searches.
    return [studioName, headingText(doc.hero?.heading)].filter(Boolean).join(' | ')
  }
  const pageTitle = collectionConfig
    ? doc.title || doc.name || ''
    : headingText(doc.hero?.heading) || globalConfig?.label?.toString() || ''
  const template = settings.seo?.titleTemplate || `%s | ${studioName}`
  return template.replace('%s', pageTitle)
}

const generateDescription: GenerateDescription<AnyDoc> = ({ doc, collectionConfig }) => {
  const text =
    collectionConfig?.slug === 'posts'
      ? doc.excerpt
      : collectionConfig?.slug === 'portfolio-items'
        ? doc.summary
        : collectionConfig?.slug === 'artists'
          ? richTextToPlainText(doc.bio)
          : doc.hero?.intro
  return truncate((text || '').replace(/\s+/g, ' ').trim(), 155)
}

const generateURL: GenerateURL<AnyDoc> = ({ doc, collectionConfig, globalConfig }) =>
  `${getServerURL()}${pathFor(globalConfig?.slug ?? collectionConfig?.slug, doc)}`

const generateImage: GenerateImage<AnyDoc> = async ({ doc, collectionConfig, req }) => {
  const own = relationID(doc.cover ?? doc.portrait ?? doc.images?.[0])
  if (own) return own
  if (collectionConfig) return ''
  const settings = await getSiteSettings(req)
  return relationID(settings.seo?.ogImage) ?? ''
}

export const seo = seoPlugin({
  globals: pageGlobalSlugs,
  tabbedUI: true,
  uploadsCollection: 'media',
  fields: () => seoFields(),
  generateTitle,
  generateDescription,
  generateURL,
  generateImage,
})
