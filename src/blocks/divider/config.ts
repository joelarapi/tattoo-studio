import type { Block } from 'payload'

/** The needle line between sections. Nothing to fill in. */
export const DividerBlock: Block = {
  slug: 'divider',
  interfaceName: 'DividerBlock',
  labels: { singular: 'Divider', plural: 'Dividers' },
  admin: { group: 'Contact and calls to action' },
  fields: [],
}
