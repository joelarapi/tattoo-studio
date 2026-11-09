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
          text(
            'studyLabel',
            'Small label above the title, before the number, e.g. "Portfolio study".',
          ),
          text('storyLabel', 'Small label above the story, e.g. "The details".'),
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
