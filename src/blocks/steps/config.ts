import type { Block } from 'payload'

import { optionalLink, paragraphs, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const StepsBlock: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps', plural: 'Steps' },
  admin: { group: 'Cards and lists' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { label: 'Compact: text left, steps right', value: 'compact' },
        { label: 'Timeline: numbered list', value: 'timeline' },
      ],
      admin: { isClearable: false },
    },
    tagField(),
    styledHeading(),
    paragraphs('text'),
    optionalLink('button', 'Orange button'),
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
      fields: [
        text('label', 'Small label above the title, e.g. "Before you travel". Optional.'),
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    optionalLink('link', 'Link under the steps'),
    sectionSettings('grid'),
  ],
}
