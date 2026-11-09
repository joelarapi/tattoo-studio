import type { Block } from 'payload'

import { image, optionalLink, paragraphs, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { linkGroup, validateHref } from '@/fields/link'

export const HomeHeroBlock: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  labels: { singular: 'Big intro with photos', plural: 'Big intros with photos' },
  admin: { group: 'Page top' },
  fields: [
    text('label', 'Small label next to the orange dot, e.g. the studio name and country.', true),
    styledHeading({ description: 'The page title (H1). White, then grey, then orange.' }),
    paragraphs('intro', 'The first paragraph under the title.', true),
    paragraphs('supporting', 'A shorter, quieter line under the intro. Optional.'),
    linkGroup({ name: 'primaryCta', label: 'Orange button' }),
    optionalLink('secondaryLink', 'Text link next to the button'),
    {
      type: 'row',
      fields: [
        {
          name: 'factValue',
          label: 'Big number',
          type: 'text',
          admin: { width: '20%', description: 'e.g. 18' },
        },
        {
          name: 'factLabel',
          label: 'Next to the number',
          type: 'text',
          admin: { width: '40%', description: 'e.g. "Years of tattoo experience".' },
        },
        {
          name: 'secondFact',
          label: 'Second fact',
          type: 'textarea',
          admin: { width: '40%', rows: 2, description: 'Short; Enter for a line break.' },
        },
      ],
    },
    image('primaryImage', 'Large image', 'Portrait format (3:4) works best.'),
    text('primaryCaption', 'Small caption on the large image. Optional.'),
    image('secondaryImage', 'Small image', 'Overlaps the large one. Portrait or square.'),
    text('secondaryCaption', 'Small caption on the small image. Optional.'),
    {
      name: 'imagesLink',
      label: 'Images link to',
      type: 'text',
      defaultValue: '/portfolio',
      validate: validateHref,
    },
    text('artNote', 'Tiny text under the images, e.g. "Art. Identity. Expression."'),
  ],
}
