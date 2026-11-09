import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { isAdmin, isAdminOrEditor } from '@/access'
import { limitUploadSize } from '@/hooks/limitUploadSize'
import {
  LEAD_IMAGE_TYPES,
  LEAD_VIDEO_TYPES,
  MAX_LEAD_IMAGE_BYTES,
  MAX_LEAD_VIDEO_BYTES,
} from '@/lib/leads'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * Reference photos and videos clients attach to enquiries. Kept apart from `media` because they're
 * private: only CMS users can open them, and in production they live in a separate private
 * bucket (S3_PRIVATE_BUCKET), served only through Payload's access-checked file route.
 */
export const LeadAttachments: CollectionConfig = {
  slug: 'lead-attachments',
  labels: { singular: 'Reference file', plural: 'Reference files' },
  admin: {
    group: 'Leads',
    description:
      'Photos and videos clients attached to enquiries. Private: never shown on the site.',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
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
        {
          mimePrefix: 'image/',
          maxBytes: MAX_LEAD_IMAGE_BYTES,
          message: 'Reference photos must be 5 MB or smaller.',
        },
        {
          mimePrefix: 'video/',
          maxBytes: MAX_LEAD_VIDEO_BYTES,
          message: 'Reference videos must be 50 MB or smaller.',
        },
      ]),
    ],
  },
  fields: [],
  upload: {
    staticDir: path.resolve(dirname, '../../media-private'),
    // No HEIC: sharp can't read it. iPhones convert to JPEG when the form only accepts these.
    mimeTypes: [...LEAD_IMAGE_TYPES, ...LEAD_VIDEO_TYPES],
    adminThumbnail: 'thumbnail',
    imageSizes: [{ name: 'thumbnail', width: 400 }],
  },
}
