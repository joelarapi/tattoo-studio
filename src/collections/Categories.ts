import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'
import { PAGE_GLOBALS } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'categories',
  paths: () => [PAGE_GLOBALS['journal-page']],
})

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Journal category', plural: 'Journal categories' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description:
      'Topics for journal posts, e.g. Planning or Aftercare. Shown as a label on each article.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Optional. For editors; not shown on the site yet. Max 160 characters.',
      },
    },
  ],
}
