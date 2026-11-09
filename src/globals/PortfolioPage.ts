import {
  linkList,
  optionalLink,
  pageHero,
  paragraphs,
  section,
  tagField,
  text,
} from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { pageGlobal } from './pageGlobal'

export const PortfolioPage = pageGlobal({
  slug: 'portfolio-page',
  label: 'Portfolio',
  description:
    'The portfolio page, plus the text shared by every piece’s own page. The pieces themselves are in Studio → Portfolio.',
  tabs: [
    { label: 'Hero', fields: [pageHero()] },
    {
      label: 'Intro',
      fields: [
        section('intro', 'Introduction', [
          tagField(),
          styledHeading(),
          {
            name: 'text',
            type: 'richText',
            editor: basicEditor,
            admin: { description: 'You can link to other pages, e.g. the contact page.' },
          },
        ]),
        section('filter', 'Filter', [
          text('allLabel', 'The first filter button, e.g. "All work".', true),
          text('countLabel', 'After the number of pieces, e.g. "pieces".'),
        ]),
      ],
    },
    {
      label: 'Piece pages',
      description: 'Shown on every portfolio piece’s own page.',
      fields: [
        section('detail', 'Piece pages', [
          text('label', 'Small label above the title, e.g. "Tisi / London InkTattoo".'),
          {
            type: 'row',
            fields: [
              {
                name: 'photoLabel',
                type: 'text',
                admin: {
                  width: '50%',
                  description: 'Under each photo; it opens the photo in colour.',
                },
              },
              {
                name: 'videoCaption',
                type: 'text',
                admin: {
                  width: '50%',
                  description: 'Under the video, after the piece’s title.',
                },
              },
            ],
          },
          text(
            'storyHeading',
            'Heading next to the photos, e.g. "Look closer." A piece can replace it.',
          ),
          paragraphs('storyNote', 'After the piece’s summary. Optional.'),
          section('direction', 'Under the story', [text('title'), paragraphs()]),
          text('ctaLabel', 'The orange button to the enquiry form.', true),
          section('travel', 'Travel band', [
            tagField(),
            styledHeading(),
            paragraphs(),
            linkList('links', 'Up to two buttons.', 2),
          ]),
          section('suggestions', 'More pieces', [
            tagField(),
            styledHeading(),
            optionalLink('button', 'Button'),
            text('cardLink', 'Link text on each card, e.g. "View this piece".'),
          ]),
        ]),
      ],
    },
  ],
})
