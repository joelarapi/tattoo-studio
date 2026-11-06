/**
 * Copies files that were uploaded to local disk (/media, /media-private) into Cloudflare R2.
 *
 *   pnpm media:to-r2
 *
 * Run it after setting the S3_* variables in .env. Each document is re-uploaded under its
 * original file name, so its image sizes are regenerated straight into the bucket. Payload
 * deletes the local copy once a file is replaced, so a placeholder from `pnpm seed` that's no
 * longer on disk is drawn again (the drawings are deterministic). Safe to rerun.
 */
import config from '@payload-config'
import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

import { type PlaceholderKind, placeholderImage } from '../src/seed/images'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const placeholderName = /^placeholder-(portrait|portfolio|cover|style|stat|og)-(\d+)\.jpg$/

const targets = [
  { collection: 'media', dir: 'media', prefix: 'media', bucketVar: 'S3_BUCKET' },
  {
    collection: 'lead-attachments',
    dir: 'media-private',
    prefix: 'leads',
    bucketVar: 'S3_PRIVATE_BUCKET',
  },
] as const

async function source(dir: string, filename: string): Promise<Buffer | null> {
  const local = await fs.readFile(path.join(root, dir, filename)).catch(() => null)
  if (local) return local
  const match = placeholderName.exec(filename)
  if (!match) return null
  return (await placeholderImage(match[1] as PlaceholderKind, Number(match[2]))).data
}

const payload = await getPayload({ config })

for (const { collection, dir, prefix, bucketVar } of targets) {
  if (!process.env[bucketVar]) {
    payload.logger.warn(`${bucketVar} is not set: skipping ${collection}.`)
    continue
  }
  const { docs } = await payload.find({ collection, limit: 0, pagination: false, depth: 0 })
  let copied = 0
  for (const doc of docs) {
    if (!doc.filename || !doc.mimeType) continue
    const data = await source(dir, doc.filename)
    if (!data) {
      payload.logger.warn(`${collection} #${doc.id}: ${doc.filename} not found locally, skipped.`)
      continue
    }
    await payload.update({
      collection,
      id: doc.id,
      data: { prefix },
      file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
      overwriteExistingFiles: true,
      // A fresh context per call: the storage plugin leaves flags on it that would make every
      // later upload skip R2 if the object were shared. No revalidation: no Next.js server here.
      context: { disableRevalidate: true },
    })
    copied++
  }
  payload.logger.info(`${collection}: copied ${copied} of ${docs.length} files to ${bucketVar}.`)
}

process.exit(0)
