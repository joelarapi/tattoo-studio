import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { basicEditor } from '@/fields/richText'
import { revalidateCollection } from '@/hooks/revalidate'
import { pathForDoc } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'legal-pages',
  paths: (doc) => (doc.slug ? [pathForDoc('legal-pages', doc.slug)] : []),
})

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Legal page', plural: 'Legal pages' },
  admin: {
    group: 'Settings',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description:
      'Privacy and cookie policies. Paste the text from your lawyer; the "last updated" date is set automatically.',
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
    { name: 'content', type: 'richText', editor: basicEditor, required: true },
  ],
}
