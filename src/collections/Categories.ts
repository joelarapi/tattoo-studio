import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'categories',
  paths: (doc) => (doc.slug ? [`/journal/category/${doc.slug}`] : []),
})

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Journal category', plural: 'Journal categories' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Topics for journal posts, e.g. Aftercare or Styles. Each gets its own page.',
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
      admin: { description: 'Shown on the category page and used for Google. Max 160 characters.' },
    },
  ],
}
