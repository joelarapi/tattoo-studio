/**
 * `pnpm seed`: fills an empty database with starting content so every page renders.
 *
 * Safe to run again: it only creates what is missing (matched by slug, title, email or file name)
 * and only fills globals that are still empty. It never deletes or overwrites anything.
 * Pages are built from sections (src/seed/pages.ts); edit them in the CMS afterwards.
 * Documents are created one at a time: orderable lists take their order from creation order.
 */
import config from '@payload-config'
import { type CollectionSlug, type DataFromCollectionSlug, getPayload, type Where } from 'payload'

import {
  artists,
  categories,
  faqs,
  homepageFilms,
  homepagePieces,
  portfolio,
  posts,
  STUDIO_NAME,
  styles,
} from './content'
import { navigation, siteSettings } from './globals'
import { type PlaceholderKind, placeholderImage } from './images'
import {
  aboutPage,
  contactPage,
  homePage,
  journalPage,
  legalPageSeeds,
  type PageRefs,
  type PageSeed,
  portfolioPage,
  visitingPage,
} from './pages'
import { photoFile, posterFile, studioFile, videoFile } from './studio-media'
import { articleTemplate, pieceTemplate } from './templates'

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

/**
 * One of the studio's photos or films (studio-media.ts), matched by file name so reruns don't
 * download it again. Null when it can't be downloaded; the caller picks a fallback.
 */
async function studioMedia(name: string, alt: string): Promise<number | null> {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: name } },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  if (docs[0]) {
    counts.existing++
    return docs[0].id
  }
  const file = await studioFile(name)
  if (!file) {
    payload.logger.warn(`Couldn't download ${name} from the design review.`)
    return null
  }
  counts.created++
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file,
    context: { ...context },
  })
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

  payload.logger.info('Seeding the studio’s portfolio (downloads about 50 MB on the first run)…')
  const pieceDocs = []
  const firstPhotos = new Map<string, number>()
  for (const [index, item] of portfolio.entries()) {
    const alt = `${item.title} on the ${item.placement.toLowerCase()}`
    const photos: number[] = []
    for (let number = 1; number <= item.photos; number++) {
      const photo = await studioMedia(photoFile(item.slug, number), alt)
      photos.push(photo ?? (await image('portfolio', index + 1, alt.toLowerCase())))
    }
    const video = item.video ? await studioMedia(videoFile(item.slug), `${item.title} video`) : null
    const videoPoster = video
      ? await studioMedia(posterFile(item.slug), `${item.title}, a still from the video`)
      : null
    // A piece needs a photo or a video.
    if (!photos.length && !video) photos.push(await image('portfolio', index + 1, alt))
    if (photos[0]) firstPhotos.set(item.slug, photos[0])

    pieceDocs.push(
      await ensure('portfolio-items', bySlug(item.slug), () =>
        payload.create({
          collection: 'portfolio-items',
          data: {
            title: item.title,
            slug: item.slug,
            summary: item.summary,
            style: styleID(item.style),
            placement: item.placement,
            images: photos,
            video,
            videoPoster,
            artist: artistID('tisi'),
            // The studio supplied these for publication; confirm consent per piece before launch.
            clientConsent: true,
            meta: {
              title: `${item.title} by Tisi in Albania | ${STUDIO_NAME}`,
              description: `${item.summary} By Tisi at ${STUDIO_NAME}, Fier, Albania.`,
            },
          },
          context,
        }),
      ),
    )
  }
  const pieceID = lookup(pieceDocs)
  const photoOf = (slug: string) => {
    const id = firstPhotos.get(slug)
    if (!id) throw new Error(`No photo for "${slug}"`)
    return id
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

  // Each FAQ lists the pages whose FAQ section shows it (seed data only).
  const faqIDs: PageRefs['faqs'] = { home: [], contact: [], visiting: [] }
  for (const { pages, ...faq } of faqs) {
    const doc = await ensure('faqs', { question: { equals: faq.question } }, () =>
      payload.create({ collection: 'faqs', data: faq, context }),
    )
    for (const page of pages) faqIDs[page].push(doc.id)
  }

  const refs: PageRefs = {
    og,
    heroImages: [
      photoOf('grim-reaper-full-back-tattoo'),
      photoOf('archangel-mary-full-sleeve-tattoo'),
    ],
    artistImage: photoOf('archangel-mary-full-sleeve-tattoo'),
    backgrounds: {
      about: photoOf('archangel-mary-full-sleeve-tattoo'),
      portfolio: photoOf('lion-cub-family-sleeve-tattoo'),
      visiting: photoOf('compass-map-quill-tattoo'),
      journal: photoOf('clock-compass-map-tattoo'),
    },
    homepagePieces: homepagePieces.map(pieceID),
    homepageFilms: homepageFilms.map(pieceID),
    artist: artistID('tisi'),
    featuredPost: lookup(postDocs)('tattoo-consultation'),
    faqs: faqIDs,
  }

  // Globals: fill only while still empty, so edits made in the CMS are never overwritten.
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
  await fillGlobal(
    'piece-template',
    !(await payload.findGlobal({ slug: 'piece-template', depth: 0 })).ctaLabel,
    pieceTemplate(),
  )
  await fillGlobal(
    'article-template',
    !(await payload.findGlobal({ slug: 'article-template', depth: 0 })).backLabel,
    articleTemplate(),
  )

  // Pages, in menu order.
  const pages: PageSeed[] = [
    homePage(refs),
    aboutPage(refs),
    portfolioPage(refs),
    visitingPage(refs),
    journalPage(refs),
    contactPage(refs),
    ...legalPageSeeds(),
  ]
  for (const page of pages) {
    await ensure('pages', bySlug(page.slug), () =>
      payload.create({ collection: 'pages', data: page, context }),
    )
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
