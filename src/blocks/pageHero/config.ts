import type { Block, Condition } from 'payload'

import { heroBackground, optionalLink, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

const centred: Condition = (_, siblingData) => siblingData?.layout !== 'split'
const split: Condition = (_, siblingData) => siblingData?.layout === 'split'

export const PageHeroBlock: Block = {
  slug: 'pageHero',
  interfaceName: 'PageHeroBlock',
  labels: { singular: 'Page top', plural: 'Page tops' },
  admin: { group: 'Page top' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'centred',
          options: [
            { label: 'Centred', value: 'centred' },
            { label: 'Text left, trip outline right', value: 'split' },
          ],
          admin: { width: '50%', isClearable: false },
        },
        {
          name: 'height',
          type: 'select',
          defaultValue: 'tall',
          options: [
            { label: 'Tall', value: 'tall' },
            { label: 'Compact', value: 'compact' },
          ],
          admin: { width: '50%', isClearable: false, condition: centred },
        },
      ],
    },
    tagField('Small label above the title.'),
    styledHeading({ description: 'The page title (H1). White, then grey, then orange.' }),
    paragraphs('intro', 'Under the title. Enter for a line break.'),
    optionalLink('button', 'Orange button'),
    paragraphs('note', 'Small print under the button. Optional.'),
    optionalLink(
      'jumpLink',
      'Link down the page',
      'e.g. "Get to know Tisi" to #artist (a section ID further down).',
    ),
    {
      ...text('indexLabel', 'Tiny line at the bottom, e.g. "01 / About us".'),
      admin: { description: 'Tiny line at the bottom, e.g. "01 / About us".', condition: centred },
    },
    {
      ...section('sidePanel', 'Trip outline (the box on the right)', [
        text('title', 'Small label at the top of the box.'),
        {
          name: 'stops',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Stop', plural: 'Stops' },
          admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
          fields: [
            text('label', 'e.g. "Arrive"'),
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'text' },
          ],
        },
        text('footnote', 'Small label at the bottom of the box.'),
      ]),
      admin: { condition: split },
    },
    {
      name: 'showJumpBar',
      label: 'Show a jump bar under the page top',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Lists every section on the page that has a jump-link label (in its Section settings).',
      },
    },
    heroBackground(),
  ],
}
