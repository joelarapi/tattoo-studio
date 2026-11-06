import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { basicEditor } from '@/fields/richText'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'artists',
  paths: (doc) => (doc.slug ? [`/artists/${doc.slug}`] : []),
})

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    group: 'Studio',
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialities', 'featured', 'updatedAt'],
    description: 'Resident artists. Drag rows to change the order they appear on the site.',
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
    { name: 'name', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: 'Portrait photo, at least 1200px tall. Shown in a 3:4 frame.' },
            },
            {
              name: 'bio',
              type: 'richText',
              editor: basicEditor,
              admin: { description: '3–5 sentences, written in the third person.' },
            },
            {
              name: 'specialities',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: { description: 'The styles this artist is known for.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'instagram',
                  label: 'Instagram URL',
                  type: 'text',
                  validate: (value: string | null | undefined) =>
                    !value ||
                    /^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/.test(value) ||
                    'Paste the full profile address, e.g. https://www.instagram.com/handle',
                  admin: { width: '50%' },
                },
                {
                  name: 'yearsOfExperience',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'featured',
      label: 'Show on homepage',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'The homepage shows up to 4 artists.' },
    },
  ],
}
