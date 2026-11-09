import type { Block } from 'payload'

import { paragraphs, tagField } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Photo grid', plural: 'Photo grids' },
  admin: { group: 'Work and studio' },
  fields: [
    tagField(),
    styledHeading({ required: false }),
    paragraphs('intro', 'Next to the heading. Optional.'),
    {
      name: 'images',
      label: 'Photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 24,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Drag to reorder. Each photo’s alt text is used as its caption.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ],
          admin: { width: '50%', isClearable: false },
        },
        {
          name: 'showCaptions',
          label: 'Show captions',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    sectionSettings(),
  ],
}
