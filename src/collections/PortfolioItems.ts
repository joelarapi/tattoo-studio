import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

const { afterChange, afterDelete } = revalidateCollection({ collection: 'portfolio-items' })

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  labels: { singular: 'Portfolio piece', plural: 'Portfolio' },
  admin: {
    group: 'Studio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'style', 'featured'],
    description:
      'Finished tattoos. Tick "Featured" to show a piece in the homepage slider. Drag rows to reorder.',
  },
  orderable: true,
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Short and descriptive, e.g. "Peony half-sleeve".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'artist',
          type: 'relationship',
          relationTo: 'artists',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'style',
          type: 'relationship',
          relationTo: 'styles',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'The first image is the one shown on cards. Drag to reorder.' },
    },
    {
      name: 'video',
      label: 'Short video (optional)',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        description:
          'A silent loop of a few seconds, MP4 or WebM, max 8 MB. Plays instead of the image on the homepage.',
      },
    },
    {
      name: 'placement',
      type: 'text',
      admin: { description: 'Where on the body, e.g. "Forearm" or "Upper back".' },
    },
    {
      name: 'clientConsent',
      label: 'The client agreed to this tattoo being published',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      validate: (value: boolean | null | undefined) =>
        value === true || 'Only publish work the client has agreed to share.',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in the homepage slider.' },
    },
  ],
}
