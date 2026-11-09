import type { Block } from 'payload'

import { tagField } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'Questions (FAQ)', plural: 'Questions (FAQ)' },
  admin: { group: 'Cards and lists' },
  fields: [
    tagField(),
    styledHeading(),
    {
      name: 'faqs',
      label: 'Questions',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        description:
          'The questions to show, in this order (Studio → FAQs). Leave empty to show them all.',
      },
    },
    sectionSettings(),
  ],
}
