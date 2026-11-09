import { pageHero, section, tagField, text } from '@/fields/content'

import { pageGlobal } from './pageGlobal'

export const JournalPage = pageGlobal({
  slug: 'journal-page',
  label: 'Journal',
  description:
    'The journal page and the labels on every article. The articles are in Content → Journal posts.',
  tabs: [
    { label: 'Hero', fields: [pageHero()] },
    {
      label: 'Featured',
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
      ],
    },
    {
      label: 'List',
      fields: [
        section('list', 'All articles', [
          text('heading', 'e.g. "From the journal."', true),
          text('searchLabel', 'Label above the search box.'),
          text('searchPlaceholder', 'Grey text inside the search box.'),
          text('emptyText', 'Shown when a search finds nothing.', true),
          text('readLabel', 'Link text on each card, e.g. "Read article".', true),
        ]),
      ],
    },
    {
      label: 'Articles',
      fields: [
        section('article', 'Article pages', [
          text('tocLabel', 'Above the list of sections, e.g. "In this guide".'),
          text('backLabel', 'Small link at the top, e.g. "All articles".', true),
          text('backButtonLabel', 'Button at the end, e.g. "Back to the journal".'),
        ]),
      ],
    },
  ],
})
