/**
 * `pnpm seed`: fills an empty database with starting content so every page renders.
 *
 * Safe to run again: it only creates what is missing (matched by slug, title, email or file name)
 * and only fills globals that are still empty. It never deletes or overwrites anything.
 * Documents are created one at a time: orderable lists take their order from creation order.
 */
import config from '@payload-config'
import { type CollectionSlug, type DataFromCollectionSlug, getPayload, type Where } from 'payload'

import { artists, categories, faqs, legalPages, portfolio, posts, styles } from './content'
import {
  aboutPage,
  contactPage,
  type GlobalRefs,
  homepage,
  journalPage,
  navigation,
  portfolioPage,
  siteSettings,
  visitingPage,
} from './globals'
import type { PageGlobalSlug } from '@/lib/routes'

import { type PlaceholderKind, placeholderImage } from './images'

// Hooks skip cache revalidation: there's no Next.js server to tell.
const context = { disableRevalidate: true }

const payload = await getPayload({ config })
const counts = { created: 0, existing: 0 }

/** Returns the existing document matching `where`, or creates it. */
async function ensure<S extends CollectionSlug>(
  collection: S,
  where: Where,
  create: () => Promise<DataFromCollectionSlug<S>>,
): Promise<DataFromCollectionSlug<S>> {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0, pagination: false })
  if (docs[0]) {
    counts.existing++
    return docs[0]
  }
  counts.created++
  return create()
}

const bySlug = (slug: string): Where => ({ slug: { equals: slug } })

function lookup<T extends { id: number; slug?: string | null }>(docs: T[]) {
  return (slug: string): number => {
    const found = docs.find((doc) => doc.slug === slug)
    if (!found) throw new Error(`Seed data refers to unknown slug "${slug}"`)
    return found.id
  }
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env')
  await ensure('users', { email: { equals: email } }, () =>
    payload.create({
      collection: 'users',
      data: { email, password, name: 'Studio admin', roles: ['admin'] },
      context,
    }),
  )
}

async function image(kind: PlaceholderKind, seed: number, alt: string): Promise<number> {
  const file = await placeholderImage(kind, seed)
  const doc = await ensure('media', { filename: { equals: file.name } }, () =>
    // A fresh context per upload: the storage plugin leaves flags on it that would make R2 skip
    // every later file if the object were shared.
    payload.create({
      collection: 'media',
      data: { alt: `Placeholder: ${alt}` },
      file,
      context: { ...context },
    }),
  )
  return doc.id
}

/** Fills a global only while it is still empty, so CMS edits are never overwritten. */
async function fillGlobal<T>(
  slug: Parameters<typeof payload.updateGlobal>[0]['slug'],
  isEmpty: boolean,
  data: T,
) {
  if (!isEmpty) return
  await payload.updateGlobal({ slug, data: data as never, context })
  payload.logger.info(`Filled ${slug}`)
}

async function main() {
  await seedAdmin()

  payload.logger.info('Seeding placeholder images (the first run takes a minute)…')
  const og = await image('og', 1, 'studio share image with drafting circles')

  const styleDocs = []
  for (const style of styles) {
    styleDocs.push(
      await ensure('styles', bySlug(style.slug), () =>
        payload.create({ collection: 'styles', data: style, context }),
      ),
    )
  }
  const styleID = lookup(styleDocs)

  const artistDocs = []
  for (const [index, artist] of artists.entries()) {
    const portrait = await image('portrait', index + 1, `portrait of ${artist.name}`)
    artistDocs.push(
      await ensure('artists', bySlug(artist.slug), () =>
        payload.create({ collection: 'artists', data: { ...artist, portrait }, context }),
      ),
    )
  }
  const artistID = lookup(artistDocs)

  for (const [index, item] of portfolio.entries()) {
    const picture = await image('portfolio', index + 1, item.title.toLowerCase())
    await ensure('portfolio-items', bySlug(item.slug), () =>
      payload.create({
        collection: 'portfolio-items',
        data: {
          ...item,
          style: styleID(item.style),
          artist: artistID('tisi'),
          images: [picture],
          clientConsent: true,
          featured: true,
        },
        context,
      }),
    )
  }

  const categoryDocs = []
  for (const category of categories) {
    categoryDocs.push(
      await ensure('categories', bySlug(category.slug), () =>
        payload.create({ collection: 'categories', data: category, context }),
      ),
    )
  }
  const categoryID = lookup(categoryDocs)

  const postDocs = []
  for (const [index, post] of posts.entries()) {
    const cover = await image('cover', index + 1, `cover for "${post.title}"`)
    postDocs.push(
      await ensure('posts', bySlug(post.slug), () =>
        payload.create({
          collection: 'posts',
          data: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover,
            content: post.content,
            author: artistID('tisi'),
            categories: [categoryID(post.category)],
            publishedAt: post.publishedAt,
            _status: 'published',
          },
          context,
        }),
      ),
    )
  }

  for (const faq of faqs) {
    await ensure('faqs', { question: { equals: faq.question } }, () =>
      payload.create({ collection: 'faqs', data: faq, context }),
    )
  }

  for (const page of legalPages) {
    await ensure('legal-pages', bySlug(page.slug), () =>
      payload.create({ collection: 'legal-pages', data: page, context }),
    )
  }

  const heroImages: GlobalRefs['heroImages'] = [
    await image('portfolio', 6, 'detailed black tattoo across the back'),
    await image('portfolio', 7, 'a botanical tattoo on the arm'),
  ]
  const reelPosters = [
    await image('portrait', 2, 'still for a film about the process'),
    await image('portrait', 3, 'still for a film about placement'),
    await image('portrait', 4, 'still for a film about the reveal'),
    await image('portfolio', 8, 'still for a close-up film'),
  ]
  const refs: GlobalRefs = {
    og,
    heroImages,
    reelPosters,
    artist: artistID('tisi'),
    featuredPost: lookup(postDocs)('tattoo-consultation'),
  }

  // Globals: fill only while still empty, so edits made in the CMS are never overwritten.
  const draft = { depth: 0, draft: true } as const
  const isEmpty = async (slug: PageGlobalSlug) =>
    !(await payload.findGlobal({ slug, ...draft })).hero?.heading?.text

  await fillGlobal(
    'site-settings',
    !(await payload.findGlobal({ slug: 'site-settings', depth: 0 })).studioName,
    siteSettings(refs),
  )
  await fillGlobal(
    'navigation',
    !(await payload.findGlobal({ slug: 'navigation', depth: 0 })).header?.links?.length,
    navigation(),
  )
  await fillGlobal('homepage', await isEmpty('homepage'), homepage(refs))
  await fillGlobal('about-page', await isEmpty('about-page'), aboutPage(refs))
  await fillGlobal('portfolio-page', await isEmpty('portfolio-page'), portfolioPage())
  await fillGlobal('visiting-page', await isEmpty('visiting-page'), visitingPage())
  await fillGlobal('journal-page', await isEmpty('journal-page'), journalPage(refs))
  await fillGlobal('contact-page', await isEmpty('contact-page'), contactPage())

  payload.logger.info(
    `Seed finished: ${counts.created} documents created, ${counts.existing} already existed.`,
  )
}

try {
  await main()
  process.exit(0)
} catch (error) {
  payload.logger.error({ err: error }, 'Seed failed')
  process.exit(1)
}
