import type { Block } from 'payload'

import { image, optionalLink, paragraphs, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const ArtistBlock: Block = {
  slug: 'artist',
  interfaceName: 'ArtistBlock',
  labels: { singular: 'Artist', plural: 'Artists' },
  admin: { group: 'Work and studio' },
  fields: [
    tagField(),
    styledHeading(),
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
      admin: { description: 'Their portrait and bio come from Studio → Artists.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'large',
          options: [
            { label: 'Large photo', value: 'large' },
            { label: 'Standard', value: 'standard' },
          ],
          admin: { width: '50%', isClearable: false },
        },
        {
          name: 'imageSide',
          label: 'Photo on the',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: { width: '50%', isClearable: false },
        },
      ],
    },
    image('image', 'Image', 'Optional. Replaces the artist’s portrait here.', false),
    text('imageNote', 'Small note on the image, e.g. "Original work by Tisi". Optional.'),
    paragraphs(
      'text',
      'Leave empty to show the artist’s bio. Leave an empty line between paragraphs.',
    ),
    optionalLink('button', 'Button'),
    paragraphs('note', 'Small note under the button, with a line beside it. Optional.'),
    paragraphs('signoff', 'Small text next to an asterisk at the end. Optional.'),
    sectionSettings(),
  ],
}
