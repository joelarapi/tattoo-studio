import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { templateBlockSlugs } from '@/blocks'
import { validateSections } from '@/blocks/validate'
import { paragraphs, section, text } from '@/fields/content'
import { revalidateGlobal } from '@/hooks/revalidate'

/*
 * The text shared by every portfolio piece's own page (/portfolio/<slug>), and the sections that
 * follow the piece. The piece itself (photos, summary, story) is in Studio → Portfolio.
 */
export const PieceTemplate: GlobalConfig = {
  slug: 'piece-template',
  label: 'Portfolio piece pages',
  admin: {
    group: 'Pages',
    description:
      'Shared by every portfolio piece’s own page. The pieces themselves are in Studio → Portfolio.',
  },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal({ global: 'piece-template' })] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Text',
          fields: [
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
                  admin: { width: '50%', description: 'Under the video, after the piece’s title.' },
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
          ],
        },
        {
          label: 'Sections after the piece',
          fields: [
            {
              name: 'after',
              label: 'Sections',
              type: 'blocks',
              blocks: [],
              blockReferences: templateBlockSlugs,
              validate: validateSections,
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                initCollapsed: true,
                description:
                  'Shown under every piece, top to bottom. "More portfolio pieces" suggests three other pieces by itself.',
              },
            },
          ],
        },
      ],
    },
  ],
}
