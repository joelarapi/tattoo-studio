import type { Block } from 'payload'

import { image, optionalLink, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { sectionSettings } from '../settings'

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image and text', plural: 'Images and text' },
  admin: { group: 'Text' },
  fields: [
    {
      name: 'imageSide',
      label: 'Image on the',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: { isClearable: false },
    },
    image('image', 'Image', 'Portrait or square works best.'),
    text('imageNote', 'Small note on the image. Optional.'),
    tagField(),
    styledHeading(),
    { name: 'body', label: 'Text', type: 'richText', editor: basicEditor },
    optionalLink('button', 'Button'),
    sectionSettings(),
  ],
}
