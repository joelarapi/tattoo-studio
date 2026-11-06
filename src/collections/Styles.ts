import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { iconField } from '@/fields/icon'
import { basicEditor } from '@/fields/richText'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'styles',
  paths: (doc) => (doc.slug ? [`/styles/${doc.slug}`] : []),
})

export const Styles: CollectionConfig = {
  slug: 'styles',
  labels: { singular: 'Tattoo style', plural: 'Tattoo styles' },
  admin: {
    group: 'Studio',
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortDescription', 'featured'],
    description:
      'The styles the studio offers. They appear in the menu, the homepage grid and the booking form. Drag rows to reorder.',
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
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Fine line' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 160,
              admin: { description: 'One or two sentences for the homepage grid. Max 160.' },
            },
            {
              name: 'longDescription',
              type: 'richText',
              editor: basicEditor,
              admin: { description: "The style's own page: how the studio approaches it." },
            },
            iconField(),
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: 'Large image at the top of the style page.' },
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
      admin: {
        position: 'sidebar',
        description: 'The "What we tattoo" grid shows 4 styles. Tick exactly 4.',
      },
    },
  ],
}
