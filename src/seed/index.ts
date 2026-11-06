/**
 * `pnpm seed`: fills an empty database with placeholder content so every page renders.
 *
 * Safe to run again: it only creates what is missing (matched by slug, title, email or file name)
 * and only fills globals that are still empty. It never deletes or overwrites anything.
 */
import config from '@payload-config'
import { type CollectionSlug, type DataFromCollectionSlug, getPayload, type Where } from 'payload'

import { artists, categories, faqs, legalPages, portfolio, posts, styles } from './content'
import { homepage, navigation, siteSettings } from './globals'
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
    payload.create({ collection: 'media', data: { alt: `Placeholder: ${alt}` }, file, context }),
  )
  return doc.id
}

async function main() {
  await seedAdmin()

  payload.logger.info('Seeding placeholder images (the first run takes a minute)…')
  const og = await image('og', 1, 'studio share image with drafting circles')
  const stats = await Promise.all(
    ['studio interior', 'artist at work', 'healed tattoo close-up', 'the resident artists'].map(
      (alt, index) => image('stat', index + 1, alt),
    ),
  )

  const styleDocs = []
  for (const [index, style] of styles.entries()) {
    const heroImage = await image('style', index + 1, `${style.name} tattoo`)
    styleDocs.push(
      await ensure('styles', bySlug(style.slug), () =>
        payload.create({ collection: 'styles', data: { ...style, heroImage }, context }),
      ),
    )
  }
  const styleID = lookup(styleDocs)

  const artistDocs = []
  for (const [index, artist] of artists.entries()) {
    const portrait = await image('portrait', index + 1, `portrait of ${artist.name}`)
    artistDocs.push(
      await ensure('artists', bySlug(artist.slug), () =>
        payload.create({
          collection: 'artists',
          data: {
            ...artist,
            portrait,
            specialities: artist.specialities.map(styleID),
            featured: true,
          },
          context,
        }),
      ),
    )
  }
  const artistID = lookup(artistDocs)

  for (const [index, item] of portfolio.entries()) {
    const picture = await image('portfolio', index + 1, `${item.title.toLowerCase()} tattoo`)
    await ensure('portfolio-items', { title: { equals: item.title } }, () =>
      payload.create({
        collection: 'portfolio-items',
        data: {
          ...item,
          artist: artistID(item.artist),
          style: styleID(item.style),
          images: [picture],
          clientConsent: true,
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

  for (const [index, post] of posts.entries()) {
    const cover = await image('cover', index + 1, `cover for "${post.title}"`)
    await ensure('posts', bySlug(post.slug), () =>
      payload.create({
        collection: 'posts',
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          cover,
          content: post.content(artistID),
          author: artistID(post.author),
          categories: [categoryID(post.category)],
          publishedAt: post.publishedAt,
          _status: 'published',
        },
        context,
      }),
    )
  }

  for (const faq of faqs) {
    await ensure('faqs', { question: { equals: faq.question } }, () =>
      payload.create({ collection: 'faqs', data: { ...faq, showOnHomepage: true }, context }),
    )
  }

  for (const page of legalPages) {
    await ensure('legal-pages', bySlug(page.slug), () =>
      payload.create({ collection: 'legal-pages', data: page, context }),
    )
  }

  // Globals: fill only while still empty, so edits made in the CMS are never overwritten.
  const media = { og, stats }
  if (!(await payload.findGlobal({ slug: 'site-settings', depth: 0 })).studioName) {
    await payload.updateGlobal({ slug: 'site-settings', data: siteSettings(media), context })
    payload.logger.info('Filled Studio details')
  }
  if (!(await payload.findGlobal({ slug: 'navigation', depth: 0 })).header?.links?.length) {
    await payload.updateGlobal({ slug: 'navigation', data: navigation(), context })
    payload.logger.info('Filled Menus')
  }
  if (!(await payload.findGlobal({ slug: 'homepage', depth: 0, draft: true })).hero?.heading) {
    await payload.updateGlobal({ slug: 'homepage', data: homepage(media), context })
    payload.logger.info('Filled and published Homepage')
  }

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
