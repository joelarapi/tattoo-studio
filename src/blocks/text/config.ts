import type { Block, Condition } from 'payload'

import { optionalLink, paragraphs, tagField } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { sectionSettings } from '../settings'

const notDocument: Condition = (_, siblingData) => siblingData?.layout !== 'document'

export const TextBlock: Block = {
  slug: 'text',
  interfaceName: 'TextBlock',
  labels: { singular: 'Text', plural: 'Texts' },
  admin: { group: 'Text' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Heading left, text right', value: 'split' },
        { label: 'Heading above the text', value: 'stacked' },
        { label: 'Document: one narrow column, for long text', value: 'document' },
      ],
      admin: {
        isClearable: false,
        description: 'Use "Document" for policies and other long pages.',
      },
    },
    {
      ...tagField(),
      admin: { description: 'Small orange label above the heading.', condition: notDocument },
    },
    styledHeading({ required: false }),
    {
      name: 'body',
      label: 'Text',
      type: 'richText',
      editor: basicEditor,
      admin: { description: 'Bold, italic, lists and links.' },
    },
    { ...optionalLink('link', 'Link'), admin: { condition: notDocument } },
    {
      ...paragraphs('note', 'Small note at the end, with a line beside it. Optional.'),
      admin: {
        description: 'Small note at the end, with a line beside it. Optional.',
        condition: notDocument,
      },
    },
    {
      name: 'showUpdated',
      label: 'Show the date the page was last updated',
      type: 'checkbox',
      defaultValue: false,
      admin: { condition: (_, siblingData) => siblingData?.layout === 'document' },
    },
    sectionSettings(),
  ],
}
