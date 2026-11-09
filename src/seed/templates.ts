import type { ArticleTemplate, PieceTemplate } from '@/payload-types'

import { STUDIO_NAME } from './content'

/* The text and sections shared by every portfolio piece's page and every article's page. */

type Seed<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export const pieceTemplate = (): Seed<PieceTemplate> => ({
  label: `Tisi / ${STUDIO_NAME} / Fier, Albania`,
  photoLabel: 'View original colours',
  videoCaption: 'A closer view of the details and placement.',
  storyHeading: 'Look closer.',
  storyNote: `Part of Tisi’s tattoo portfolio at ${STUDIO_NAME} in Fier, Albania. Open a photograph to see its original colours and details.`,
  direction: {
    title: 'Your own direction.',
    text: 'We take time to discuss your idea. Bring references, a story or a rough starting point. If you do not have one yet, we can explore the direction together and design something for you.',
  },
  ctaLabel: 'Discuss your tattoo',
  after: [
    {
      blockType: 'pageCta',
      source: 'own',
      style: 'band',
      tag: 'Thinking of travelling for your piece?',
      heading: { text: 'Your tattoo.', soft: 'Your visit to Albania.' },
      text: `${STUDIO_NAME} is in Fier, Albania. Meet Tisi, an artist with 18 years of tattoo experience, and discuss your idea before planning travel around an appointment.`,
      links: [
        { label: 'Meet Tisi', href: '/about' },
        { label: 'Plan your visit', href: '/visiting-albania' },
      ],
    },
    {
      blockType: 'pieceSuggestions',
      tag: 'Keep exploring',
      heading: { text: 'More work by Tisi.' },
      button: { label: 'All portfolio', href: '/portfolio' },
      cardLink: 'View this piece',
    },
  ],
})

export const articleTemplate = (): Seed<ArticleTemplate> => ({
  tocLabel: 'In this guide',
  backLabel: 'All articles',
  backButtonLabel: 'Back to the journal',
  after: [{ blockType: 'pageCta', source: 'shared' }],
})
