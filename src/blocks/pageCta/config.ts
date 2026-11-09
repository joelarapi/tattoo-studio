import type { Block, Condition } from 'payload'

import { linkList, optionalLink, paragraphs, tagField } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

const own: Condition = (_, siblingData) => siblingData?.source === 'own'
const band: Condition = (_, siblingData) =>
  siblingData?.source === 'own' && siblingData?.style === 'band'
const centred: Condition = (_, siblingData) =>
  siblingData?.source === 'own' && siblingData?.style !== 'band'

export const PageCtaBlock: Block = {
  slug: 'pageCta',
  interfaceName: 'PageCtaBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  admin: { group: 'Contact and calls to action' },
  fields: [
    {
      name: 'source',
      label: 'Text',
      type: 'select',
      defaultValue: 'shared',
      options: [
        { label: 'The shared one (Studio details → Shared sections)', value: 'shared' },
        { label: 'Its own text', value: 'own' },
      ],
      admin: {
        isClearable: false,
        description: 'The shared one is edited once and appears on every page that uses it.',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'centred',
      options: [
        { label: 'Centred, on the grid', value: 'centred' },
        { label: 'Band with up to two buttons', value: 'band' },
      ],
      admin: { isClearable: false, condition: own },
    },
    {
      ...tagField(),
      admin: { description: 'Small orange label above the heading.', condition: own },
    },
    { ...styledHeading({ required: false }), admin: { condition: own } },
    { ...paragraphs('text'), admin: { description: 'Optional.', condition: own } },
    { ...optionalLink('button', 'Orange button'), admin: { condition: centred } },
    {
      ...linkList('links', 'Up to two buttons.', 2),
      admin: { description: 'Up to two buttons.', condition: band },
    },
    {
      ...paragraphs('note', 'Small print under the button. Optional.'),
      admin: { description: 'Small print under the button. Optional.', condition: centred },
    },
  ],
}
