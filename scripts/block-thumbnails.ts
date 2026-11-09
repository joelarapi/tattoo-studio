/**
 * `pnpm blocks:thumbnails`: the pictures in the admin's "Add section" drawer
 * (public/admin/blocks/<block>.png), taken from the running site with photos and films left out.
 *
 * Needs a dev or production server with the seeded pages: set THUMBNAIL_BASE_URL (default
 * http://localhost:3000). Sections the seeded pages don't use (Image and text, Photo grid) are
 * shown on a temporary page that is deleted again at the end. NEXT_PUBLIC_SITE_URL and
 * REVALIDATE_SECRET must match the running server, so it serves that page straight away.
 */
import config from '@payload-config'
import { chromium } from '@playwright/test'
import { mkdir } from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { blocks } from '@/blocks'

const BASE_URL = (process.env.THUMBNAIL_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const OUT_DIR = path.resolve(process.cwd(), 'public/admin/blocks')
const TEMP_SLUG = 'block-thumbnails-temp'
// The drawer shows them at about 240 px wide; 480 keeps them sharp on high-density screens.
const WIDTH = 480
const HEIGHT = 300

const payload = await getPayload({ config })
// The temporary page is revalidated like any other (through the running server's
// /api/revalidate), so the server serves it straight away.
const context = {}

async function createTempPage() {
  const { docs: media } = await payload.find({
    collection: 'media',
    where: { mimeType: { contains: 'image' } },
    limit: 6,
    depth: 0,
  })
  const ids = media.map((doc) => doc.id)
  await payload.delete({ collection: 'pages', where: { slug: { equals: TEMP_SLUG } }, context })
  return payload.create({
    collection: 'pages',
    context,
    data: {
      title: 'Block thumbnails (temporary)',
      slug: TEMP_SLUG,
      _status: 'published',
      layout: [
        {
          blockType: 'imageText',
          imageSide: 'left',
          image: ids[0],
          tag: 'Image and text',
          heading: { text: 'A photo.', soft: 'And a story.' },
          body: {
            root: {
              type: 'root',
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  children: [
                    {
                      type: 'text',
                      version: 1,
                      text: 'A framed photo beside a heading, text and a button.',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                    },
                  ],
                },
              ],
            },
          },
          button: { label: 'A button', href: '/' },
        },
        {
          blockType: 'gallery',
          tag: 'Photo grid',
          heading: { text: 'Photos.', soft: 'In a grid.' },
          images: ids.slice(0, 3),
          columns: '3',
        },
      ],
    },
  })
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const temp = await createTempPage()
  const paths = [
    '/',
    '/about',
    '/portfolio',
    '/visiting-albania',
    '/journal',
    '/contact',
    '/privacy',
    `/${TEMP_SLUG}`,
    // "More portfolio pieces" is under every piece (Portfolio piece pages → Sections after).
    '/portfolio/joker-playing-cards-sleeve',
  ]
  const wanted = new Set(blocks.map((block) => block.slug))
  const browser = await chromium.launch()
  // Reduced motion: line art fully drawn, no colour cycle.
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  try {
    for (const route of paths) {
      if (!wanted.size) break
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })
      // Reveal everything that fades in on scroll. Photos and films are left out (their frames
      // stay): the thumbnails are committed, and clients' tattoos stay out of git.
      await page.addStyleTag({
        content:
          '[data-reveal]{opacity:1!important;transform:none!important} main img,main video{visibility:hidden!important}',
      })
      for (const slug of [...wanted]) {
        const section = page.locator(`[data-block="${slug}"]`).first()
        if (!(await section.count())) continue
        await section.scrollIntoViewIfNeeded()
        const box = await section.boundingBox()
        if (!box) continue
        const top = box.y + (await page.evaluate(() => window.scrollY))
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
        // Always the thumbnail's shape, from the section's top, so nothing is cropped sideways.
        // Thin sections (the divider) sit in the middle of the frame, with what's around them.
        const frame = Math.round(box.width * (HEIGHT / WIDTH))
        const start = box.height < frame / 3 ? top + box.height / 2 - frame / 2 : top
        const shot = await page.screenshot({
          fullPage: true,
          clip: {
            x: box.x,
            y: Math.max(0, Math.min(start, pageHeight - frame)),
            width: box.width,
            height: frame,
          },
        })
        await sharp(shot)
          .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })
          .png({ compressionLevel: 9 })
          .toFile(path.join(OUT_DIR, `${slug}.png`))
        wanted.delete(slug)
        payload.logger.info(`Saved ${slug}.png (from ${route})`)
      }
    }
  } finally {
    await browser.close()
    await payload.delete({ collection: 'pages', id: temp.id, context })
  }
  if (wanted.size) payload.logger.warn(`No section found for: ${[...wanted].join(', ')}`)
}

try {
  await main()
  process.exit(0)
} catch (error) {
  payload.logger.error({ err: error }, 'Thumbnails failed')
  process.exit(1)
}
