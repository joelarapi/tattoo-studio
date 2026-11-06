import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { isAdmin, isAdminOrEditor } from '@/access'
import { limitUploadSize } from '@/hooks/limitUploadSize'
import { MAX_LEAD_IMAGE_BYTES } from '@/lib/leads'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * Reference images clients attach to booking requests. Kept apart from `media` because they're
 * private: only CMS users can open them, and in production they live in a separate private
 * bucket (S3_PRIVATE_BUCKET), served only through Payload's access-checked file route.
 */
export const LeadAttachments: CollectionConfig = {
  slug: 'lead-attachments',
  labels: { singular: 'Reference image', plural: 'Reference images' },
  admin: {
    group: 'Leads',
    description: 'Images clients attached to booking requests. Private: never shown on the site.',
    defaultColumns: ['filename', 'filesize', 'createdAt'],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      limitUploadSize([
        { maxBytes: MAX_LEAD_IMAGE_BYTES, message: 'Reference images must be 5 MB or smaller.' },
      ]),
    ],
  },
  fields: [],
  upload: {
    staticDir: path.resolve(dirname, '../../media-private'),
    // No HEIC: sharp can't read it. iPhones convert to JPEG when the form only accepts these.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    adminThumbnail: 'thumbnail',
    imageSizes: [{ name: 'thumbnail', width: 400 }],
  },
}
