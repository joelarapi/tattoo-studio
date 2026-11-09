import type { Block } from 'payload'

import { optionalLink, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const WorkShowcaseBlock: Block = {
  slug: 'workShowcase',
  interfaceName: 'WorkShowcaseBlock',
  labels: { singular: 'Portfolio gallery (sideways)', plural: 'Portfolio galleries (sideways)' },
  admin: { group: 'Work and studio' },
  fields: [
    tagField(),
    styledHeading(),
    paragraphs('intro', 'Next to the heading. Enter for a line break.'),
    optionalLink('button', 'Button'),
    text(
      'creditLine',
      'Tiny line above the photos and under the films, e.g. "Original work by Tisi".',
    ),
    text('trackLabel', 'Small label above the photos, e.g. "Photos · scroll at your own pace".'),
    {
      name: 'pieces',
      label: 'Photos',
      type: 'relationship',
      relationTo: 'portfolio-items',
      hasMany: true,
      maxRows: 12,
      admin: {
        description:
          'The pieces in the photo gallery, in this order. Leave empty to show the first 9 of the portfolio.',
      },
    },
    {
      name: 'colourCycle',
      label: 'Show one photo at a time in colour',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Every few seconds one photo turns to its original colours. Stops as soon as a visitor scrolls the gallery.',
      },
    },
    section(
      'films',
      'Films',
      [
        text('trackLabel', 'Small label above the films.'),
        {
          type: 'row',
          fields: [
            {
              name: 'itemLabel',
              type: 'text',
              admin: { width: '50%', description: 'Top of each card, e.g. "Tisi / film".' },
            },
            {
              name: 'watchLabel',
              type: 'text',
              defaultValue: 'Watch the tattoo video',
              admin: { width: '50%', description: 'Link at the bottom of each card.' },
            },
          ],
        },
        {
          name: 'pieces',
          label: 'Films',
          type: 'relationship',
          relationTo: 'portfolio-items',
          hasMany: true,
          maxRows: 12,
          filterOptions: { video: { exists: true } },
          admin: {
            description:
              'Pieces with a video, in this order. Each card shows the video cover and opens the piece’s page. Leave empty to leave the films out.',
          },
        },
      ],
      'A second gallery under the photos.',
    ),
    sectionSettings(),
  ],
}
