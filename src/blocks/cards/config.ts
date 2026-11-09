import type { Block, Condition, Field } from 'payload'

import { optionalLink, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { headingSize, sectionSettings } from '../settings'

type CardStyle = 'numbered' | 'panel' | 'feature' | 'place'

/** Shows a card field only for some card styles (the block's `style`). */
const forStyles =
  (...styles: CardStyle[]): Condition =>
  (_, __, { blockData }) =>
    styles.includes((blockData as { style?: CardStyle } | undefined)?.style ?? 'numbered')

const cardFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        admin: {
          width: '40%',
          description: 'Small label after the number, e.g. "Your idea".',
          condition: forStyles('numbered', 'panel'),
        },
      },
      {
        name: 'tag',
        type: 'text',
        admin: {
          width: '40%',
          description: 'Small orange label above the title.',
          condition: forStyles('feature', 'place'),
        },
      },
      {
        name: 'graphic',
        type: 'select',
        options: [
          { label: 'Sketch', value: 'sketch' },
          { label: 'Machine', value: 'machine' },
          { label: 'Ink', value: 'ink' },
          { label: 'Circles', value: 'circles' },
          { label: 'Bars', value: 'bars' },
          { label: 'Asterisk', value: 'asterisk' },
        ],
        admin: {
          width: '30%',
          description: 'Optional.',
          condition: forStyles('numbered'),
        },
      },
      {
        name: 'symbol',
        type: 'select',
        defaultValue: 'home',
        options: [
          { label: 'House', value: 'home' },
          { label: 'Arrow', value: 'arrow' },
        ],
        admin: { width: '30%', condition: forStyles('feature') },
      },
      {
        name: 'motif',
        label: 'Graphic',
        type: 'select',
        defaultValue: 'columns',
        options: [
          { label: 'Columns (history)', value: 'columns' },
          { label: 'Windows (old town)', value: 'windows' },
          { label: 'Waves (coast)', value: 'waves' },
        ],
        admin: { width: '30%', condition: forStyles('place') },
      },
    ],
  },
  { name: 'title', type: 'textarea', required: true, admin: { rows: 2 } },
  paragraphs('text', 'Leave an empty line between paragraphs.'),
  {
    name: 'checklist',
    type: 'textarea',
    admin: { description: 'One item per line. Optional.', condition: forStyles('feature') },
  },
  optionalLink('link', 'Link'),
]

export const CardsBlock: Block = {
  slug: 'cards',
  interfaceName: 'CardsBlock',
  labels: { singular: 'Cards', plural: 'Cards' },
  admin: { group: 'Cards and lists' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          label: 'Card style',
          type: 'select',
          defaultValue: 'numbered',
          options: [
            { label: 'Numbered ("01 / …")', value: 'numbered' },
            { label: 'Panels', value: 'panel' },
            { label: 'Boxes with a symbol and checklist', value: 'feature' },
            { label: 'Places with a graphic', value: 'place' },
          ],
          admin: { width: '40%', isClearable: false },
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ],
          admin: { width: '30%', isClearable: false },
        },
        { ...headingSize('md'), admin: { width: '30%', isClearable: false } },
      ],
    },
    tagField(),
    styledHeading(),
    paragraphs('intro', 'Next to the heading. Enter for a line break.'),
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
      fields: cardFields,
    },
    section(
      'note',
      'Note under the cards',
      [
        text('title', 'Bold start of the note, e.g. a question.'),
        paragraphs(),
        optionalLink('link', 'Link'),
      ],
      'A line with an asterisk under the cards. Optional.',
    ),
    paragraphs('notice', 'A boxed note under the cards. Optional.'),
    paragraphs('smallPrint', 'Small print under the cards. Optional.'),
    section(
      'closingNote',
      'Closing note',
      [
        tagField(),
        { name: 'title', type: 'textarea', admin: { rows: 2 } },
        { name: 'text', type: 'richText', editor: basicEditor },
      ],
      'A titled note at the end of the section, under a line. Optional.',
    ),
    sectionSettings(),
  ],
}
