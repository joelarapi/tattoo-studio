import type { Block } from 'payload'

import { optionalLink, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const PieceSuggestionsBlock: Block = {
  slug: 'pieceSuggestions',
  interfaceName: 'PieceSuggestionsBlock',
  labels: { singular: 'More portfolio pieces', plural: 'More portfolio pieces' },
  admin: { group: 'Work and studio' },
  fields: [
    tagField(),
    styledHeading(),
    optionalLink('button', 'Button'),
    text('cardLink', 'Link text on each card, e.g. "View this piece".'),
    {
      name: 'pieces',
      type: 'relationship',
      relationTo: 'portfolio-items',
      hasMany: true,
      maxRows: 6,
      admin: {
        description:
          'Optional. On a piece’s own page, leave empty to suggest three others automatically.',
      },
    },
    sectionSettings(),
  ],
}
