import type { Block } from 'payload'

import { optionalLink, tagField } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  interfaceName: 'LatestPostsBlock',
  labels: { singular: 'Latest journal posts', plural: 'Latest journal posts' },
  admin: { group: 'Cards and lists' },
  fields: [
    tagField(),
    styledHeading(),
    optionalLink('link', 'Link'),
    {
      name: 'count',
      label: 'How many posts',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      required: true,
      admin: { description: 'The newest published posts. Hidden when there are none.' },
    },
    sectionSettings(),
  ],
}
