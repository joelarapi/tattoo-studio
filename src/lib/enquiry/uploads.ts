/*
 * Reference files go from the visitor's browser straight to the private R2 bucket (Vercel caps
 * request bodies at 4.5 MB), into `client-enquiries/pending/`. Only when the enquiry is sent does
 * the server re-save them as `lead-attachments`; an R2 lifecycle rule deletes whatever is left in
 * pending/ after a day.
 */
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import { LEAD_FILES_PREFIX } from '@/lib/leads'
import { s3ClientConfig } from '@/lib/s3'

import { extensionFor, type ReferenceFile } from './fields'
import type { TicketFile } from './ticket'

export const PENDING_PREFIX = `${LEAD_FILES_PREFIX}/pending/`

/** Upload links stop working after this long (the upload must start before then). */
const UPLOAD_URL_LIFETIME_S = 30 * 60

const bucket = () => process.env.S3_PRIVATE_BUCKET || ''

let client: S3Client | undefined
// Newer AWS SDKs add checksums R2 doesn't need; send them only when an operation requires one.
const getClient = () =>
  (client ??= new S3Client({
    ...s3ClientConfig,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  }))

/** A pending key for each file, in a fresh folder, and a signed link to upload it. */
export async function createUploadLinks(files: ReferenceFile[]) {
  const folder = `${PENDING_PREFIX}${randomUUID()}/`
  return Promise.all(
    files.map(async ({ type, size }, index) => {
      const key = `${folder}${index + 1}.${extensionFor(type)}`
      // The signature covers the type and exact size, so the link can't carry anything else.
      const url = await getSignedUrl(
        getClient(),
        new PutObjectCommand({
          Bucket: bucket(),
          Key: key,
          ContentType: type,
          ContentLength: size,
        }),
        {
          expiresIn: UPLOAD_URL_LIFETIME_S,
          signableHeaders: new Set(['content-type', 'content-length']),
        },
      )
      return { key, type, size, url }
    }),
  )
}

/** Whether the file arrived in pending/ with the size and type the ticket allowed. */
export async function isUploaded({ key, type, size }: TicketFile) {
  if (!key.startsWith(PENDING_PREFIX)) return false
  try {
    const head = await getClient().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }))
    return head.ContentLength === size && head.ContentType === type
  } catch {
    return false
  }
}

/** Streams a pending file to disk, so large videos never sit in memory. */
export async function downloadUpload(key: string, filePath: string) {
  const object = await getClient().send(new GetObjectCommand({ Bucket: bucket(), Key: key }))
  if (!(object.Body instanceof Readable)) throw new Error(`No body for ${key}`)
  await pipeline(object.Body, createWriteStream(filePath))
}

/** Removes pending files once they're saved (the lifecycle rule would, a day later). */
export async function deleteUploads(keys: string[]) {
  // One request per file (at most five): the batch delete needs a checksum header R2 may refuse.
  await Promise.all(
    keys
      .filter((key) => key.startsWith(PENDING_PREFIX))
      .map((Key) => getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key }))),
  )
}
