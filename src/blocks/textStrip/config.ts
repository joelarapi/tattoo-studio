import type { Block } from 'payload'

export const TextStripBlock: Block = {
  slug: 'textStrip',
  interfaceName: 'TextStripBlock',
  labels: { singular: 'Phrase band', plural: 'Phrase bands' },
  admin: { group: 'Text' },
  fields: [
    {
      name: 'phrases',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Phrase', plural: 'Phrases' },
      admin: {
        description: 'Short phrases in a band across the page, separated by asterisks.',
        components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
