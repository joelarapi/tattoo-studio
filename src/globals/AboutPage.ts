import {
  cardList,
  image,
  optionalLink,
  pageHero,
  paragraphs,
  section,
  tagField,
  text,
} from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { pageGlobal } from './pageGlobal'

export const AboutPage = pageGlobal({
  slug: 'about-page',
  label: 'About',
  description: 'The About page: the artist, the work and the studio.',
  tabs: [
    {
      label: 'Hero',
      fields: [
        pageHero([text('scrollLabel', 'Link down to the artist, e.g. "Get to know Tisi".')]),
      ],
    },
    {
      label: 'Artist',
      fields: [
        section(
          'meetArtist',
          'Meet the artist',
          [
            tagField(),
            styledHeading(),
            {
              name: 'artist',
              type: 'relationship',
              relationTo: 'artists',
              required: true,
              admin: { description: 'Their portrait and bio (Studio → Artists) are shown here.' },
            },
            image('image', 'Image', 'Optional. Replaces the artist portrait on this page.', false),
            optionalLink('button', 'Button'),
            paragraphs('note', 'Small note under the button. Optional.'),
          ],
          'The text comes from the artist’s bio.',
        ),
      ],
    },
    {
      label: 'The work',
      fields: [
        section('focus', 'The work behind the experience', [
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          cardList({ name: 'items', label: 'Specialities', maxRows: 2, link: true }),
        ]),
      ],
    },
    {
      label: 'Approach',
      fields: [
        section('values', 'Your idea, at the centre', [
          tagField(),
          styledHeading(),
          cardList({ maxRows: 3, description: 'Three cards, each with its own small graphic.' }),
        ]),
      ],
    },
    {
      label: 'Studio',
      fields: [
        section('studio', 'The studio', [
          tagField(),
          styledHeading(),
          paragraphs(),
          optionalLink('link', 'Link'),
          paragraphs('note', 'Small note at the end. Optional.'),
        ]),
      ],
    },
  ],
})
