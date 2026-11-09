import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { basicEditor } from '@/fields/richText'
import { revalidateCollection } from '@/hooks/revalidate'
import { faqPageOptions } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({ collection: 'faqs' })

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    group: 'Studio',
    useAsTitle: 'question',
    defaultColumns: ['question', 'pages', 'updatedAt'],
    description:
      'Questions and answers. Google can show these directly in search results. Drag rows to reorder.',
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
      name: 'question',
      type: 'text',
      required: true,
      admin: { description: 'Phrase it the way a client would ask it.' },
    },
    {
      name: 'answer',
      type: 'richText',
      editor: basicEditor,
      required: true,
      admin: { description: 'Two to four sentences. Answer the question in the first one.' },
    },
    {
      name: 'pages',
      label: 'Show on',
      type: 'select',
      hasMany: true,
      defaultValue: ['home'],
      options: faqPageOptions.map((option) => ({ ...option })),
      admin: {
        position: 'sidebar',
        description: 'The pages this question appears on. Aim for 4–8 per page.',
      },
    },
  ],
}
