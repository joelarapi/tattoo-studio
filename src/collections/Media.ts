import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { anyone, isAdminOrEditor } from '@/access'
import { limitUploadSize } from '@/hooks/limitUploadSize'
import { revalidateCollection } from '@/hooks/revalidate'
import { MAX_VIDEO_BYTES } from '@/lib/leads'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const { afterChange, afterDelete } = revalidateCollection({ collection: 'media' })

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image or video', plural: 'Images & videos' },
  admin: {
    group: 'Content',
    description:
      'Every image and video on the site. Upload large originals; the site makes smaller copies automatically.',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [
      limitUploadSize([
        {
          mimePrefix: 'video/',
          maxBytes: MAX_VIDEO_BYTES,
          message: 'Videos must be 8 MB or smaller. Shorten or compress the clip and try again.',
        },
      ]),
    ],
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows, for blind visitors and for Google. e.g. "Fine-line rose tattoo on a forearm".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the image where the design has room for it.' },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    // No SVG: uploaded SVGs can carry scripts.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    // Next/Image serves AVIF or WebP to browsers from these, so they're stored as WebP.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp', options: { quality: 82 } } },
      // Social networks handle JPEG most reliably.
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 85 } },
      },
    ],
  },
}
