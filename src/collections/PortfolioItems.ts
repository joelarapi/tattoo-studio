import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'
import { PAGE_GLOBALS, pathForDoc } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'portfolio-items',
  paths: (doc) =>
    doc.slug ? [PAGE_GLOBALS['portfolio-page'], pathForDoc('portfolio-items', doc.slug)] : [],
})

const piecePath = (data: { slug?: string | null } | undefined) =>
  generatePreviewPath(pathForDoc('portfolio-items', data?.slug))

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  labels: { singular: 'Portfolio piece', plural: 'Portfolio' },
  admin: {
    group: 'Studio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'style', 'placement', 'featured'],
    description:
      'Finished tattoos. Each piece gets its own page. Tick "Featured" to show it on the homepage. Drag rows to reorder.',
    livePreview: { url: ({ data }) => piecePath(data) },
    preview: (data) => piecePath(data),
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
      admin: {
        description: 'Short and descriptive, e.g. "Botanical arm tattoo". It is the page title.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Piece',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Two or three sentences. Shown on the portfolio card and at the top of the piece’s page.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'style',
                  label: 'Category',
                  type: 'relationship',
                  relationTo: 'styles',
                  required: true,
                  admin: { width: '50%', description: 'Used by the portfolio filter.' },
                },
                {
                  name: 'placement',
                  type: 'text',
                  admin: { width: '50%', description: 'Where on the body, e.g. "Forearm".' },
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
              admin: { description: 'MP4 or WebM, max 8 MB. Shown on the piece’s page.' },
            },
            {
              name: 'artist',
              type: 'relationship',
              relationTo: 'artists',
              admin: { description: 'Optional while the studio has one artist.' },
            },
          ],
        },
        {
          label: 'Story',
          description: 'The text next to the photo on the piece’s own page.',
          fields: [
            {
              name: 'detailsHeading',
              label: 'Heading',
              type: 'text',
              admin: { description: 'e.g. "A statement across the back."' },
            },
            {
              name: 'story',
              type: 'array',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              maxRows: 6,
              admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
              fields: [
                { name: 'title', type: 'text', admin: { description: 'e.g. "Look closer."' } },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'clientConsent',
      label: 'The client agreed to this tattoo being published',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      validate: (value: boolean | null | undefined) =>
        value === true || 'Only publish work the client has agreed to share.',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in the homepage gallery.' },
    },
  ],
}
