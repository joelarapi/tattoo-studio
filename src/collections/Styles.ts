import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'
import { PAGE_GLOBALS } from '@/lib/routes'

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'styles',
  paths: () => [PAGE_GLOBALS['portfolio-page']],
})

export const Styles: CollectionConfig = {
  slug: 'styles',
  labels: { singular: 'Portfolio category', plural: 'Portfolio categories' },
  admin: {
    group: 'Studio',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    description:
      'Categories for portfolio pieces, e.g. Graphic or Botanical. They become the portfolio filter buttons. Drag rows to reorder.',
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
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Botanical' } },
    slugField({ useAsSlug: 'name' }),
  ],
}
