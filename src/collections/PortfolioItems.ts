import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'
import { pathForDoc } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'portfolio-items',
  paths: (doc) =>
    doc.slug ? [pathForDoc('pages', 'portfolio'), pathForDoc('portfolio-items', doc.slug)] : [],
})

const piecePath = (data: { slug?: string | null } | undefined) =>
  generatePreviewPath(pathForDoc('portfolio-items', data?.slug))

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  labels: { singular: 'Portfolio piece', plural: 'Portfolio' },
  admin: {
    group: 'Studio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'style', 'placement', 'updatedAt'],
    description:
      'Finished tattoos. Each piece gets its own page. Drag rows to reorder. The homepage shows the pieces chosen in Pages → Homepage → Portfolio.',
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
              label: 'Photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              filterOptions: { mimeType: { contains: 'image' } },
              // A piece needs something to show: a photo, or at least a video.
              validate: (value, { siblingData }) =>
                (Array.isArray(value) && value.length > 0) ||
                Boolean((siblingData as { video?: unknown })?.video) ||
                'Add at least one photo or a video.',
              admin: {
                description: 'The first photo is the one shown on cards. Drag to reorder.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'video',
                  label: 'Short video (optional)',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'video' } },
                  admin: {
                    width: '50%',
                    description: 'MP4 or WebM, max 8 MB. Shown on the piece’s page.',
                  },
                },
                {
                  name: 'videoPoster',
                  label: 'Video cover',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'image' } },
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => Boolean(siblingData?.video),
                    description:
                      'A still from the video, portrait format. Shown before it plays and on the homepage film cards.',
                  },
                },
              ],
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
          description:
            'Optional. The text next to the photos is shared by every piece (Pages → Portfolio → Piece pages); add to it here.',
          fields: [
            {
              name: 'detailsHeading',
              label: 'Heading',
              type: 'text',
              admin: {
                description: 'Replaces the shared heading ("Look closer.") for this piece.',
              },
            },
            {
              name: 'story',
              type: 'array',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              maxRows: 6,
              admin: {
                description: 'Extra paragraphs after the summary, each with an optional title.',
                components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', admin: { description: 'e.g. "The placement."' } },
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
  ],
}
