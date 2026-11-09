import type { Block } from 'payload'

import { section, tagField, text } from '@/fields/content'

import { sectionSettings } from '../settings'

export const JournalListBlock: Block = {
  slug: 'journalList',
  interfaceName: 'JournalListBlock',
  labels: { singular: 'Journal: featured and all articles', plural: 'Journal lists' },
  admin: { group: 'Cards and lists' },
  fields: [
    section('featured', 'Featured article', [
      tagField('Small label above the featured article.'),
      {
        name: 'post',
        type: 'relationship',
        relationTo: 'posts',
        admin: { description: 'Leave empty to feature the latest article.' },
      },
      text('label', 'Small label on the featured card, e.g. "Featured guide".'),
      text('buttonLabel', 'e.g. "Read the guide"', true),
    ]),
    section('list', 'All articles', [
      text('heading', 'e.g. "From the journal."', true),
      text('searchLabel', 'Label above the search box.'),
      text('searchPlaceholder', 'Grey text inside the search box.'),
      text('emptyText', 'Shown when a search finds nothing.', true),
      text('readLabel', 'Link text on each card, e.g. "Read article".', true),
    ]),
    sectionSettings(),
  ],
}
