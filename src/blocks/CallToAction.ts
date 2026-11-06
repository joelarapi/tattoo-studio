import type { Block } from 'payload'

import { linkGroup } from '@/fields/link'

/** A booking prompt editors can drop between paragraphs of a journal post. */
export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Thinking about your first piece?"' },
    },
    { name: 'text', type: 'textarea', admin: { description: 'One or two sentences.' } },
    linkGroup({ name: 'button', label: 'Button' }),
  ],
}
