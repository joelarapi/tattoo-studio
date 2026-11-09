import type { Block } from 'payload'

import { section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { sectionSettings } from '../settings'

export const PortfolioGridBlock: Block = {
  slug: 'portfolioGrid',
  interfaceName: 'PortfolioGridBlock',
  labels: { singular: 'Portfolio grid with filter', plural: 'Portfolio grids with filter' },
  admin: { group: 'Work and studio' },
  fields: [
    section('intro', 'Introduction', [
      tagField(),
      styledHeading({ required: false }),
      {
        name: 'text',
        type: 'richText',
        editor: basicEditor,
        admin: { description: 'You can link to other pages, e.g. the contact page.' },
      },
    ]),
    {
      name: 'style',
      label: 'Only this category',
      type: 'relationship',
      relationTo: 'styles',
      admin: { description: 'Optional. Leave empty to show every piece, with the filter.' },
    },
    {
      type: 'row',
      fields: [
        {
          ...text('allLabel', 'The first filter button, e.g. "All work".', true),
          admin: { width: '50%', description: 'The first filter button, e.g. "All work".' },
        },
        {
          ...text('countLabel', 'After the number of pieces, e.g. "Projects".'),
          admin: { width: '50%', description: 'After the number of pieces, e.g. "Projects".' },
        },
      ],
    },
    sectionSettings(),
  ],
}
