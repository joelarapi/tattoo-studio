import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { basicEditor } from '@/fields/richText'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'
import { PAGE_GLOBALS } from '@/lib/routes'

// Artists appear on the homepage and the About page (chosen there), not on pages of their own.
const { afterChange, afterDelete } = revalidateCollection({
  collection: 'artists',
  paths: () => [PAGE_GLOBALS.homepage, PAGE_GLOBALS['about-page']],
})

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    group: 'Studio',
    useAsTitle: 'name',
    defaultColumns: ['name', 'yearsOfExperience', 'updatedAt'],
    description:
      'The studio’s artists: portrait and bio. The homepage and About page show the artist chosen there; journal posts can name one as author.',
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
              admin: { description: 'A few short paragraphs. Shown on the About page.' },
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
  ],
}
