import type { ArrayField } from 'payload'

import { image, optionalLink, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { linkGroup, validateHref } from '@/fields/link'

import { pageGlobal } from './pageGlobal'

const steps: ArrayField = {
  name: 'steps',
  type: 'array',
  maxRows: 3,
  labels: { singular: 'Step', plural: 'Steps' },
  admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
}

/*
 * Every homepage text, in page order. Section numbers ("01 / …") are added by the site in the
 * order the sections appear.
 */
export const Homepage = pageGlobal({
  slug: 'homepage',
  label: 'Homepage',
  description:
    'All homepage text, section by section. Changes autosave as a draft; press Publish to put them live.',
  tabs: [
    {
      label: 'Hero',
      fields: [
        section('hero', 'Hero', [
          text(
            'label',
            'Small label next to the orange dot, e.g. the studio name and country.',
            true,
          ),
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
        ]),
        {
          name: 'strip',
          label: 'Text strip',
          type: 'array',
          maxRows: 6,
          labels: { singular: 'Phrase', plural: 'Phrases' },
          admin: {
            description: 'Short phrases in the band under the hero, separated by asterisks.',
            components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
          },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      label: 'Portfolio',
      fields: [
        section('work', 'Portfolio', [
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          optionalLink('button', 'Button'),
          text(
            'creditLine',
            'Tiny line above the photos and under the films, e.g. "Original work by Tisi".',
          ),
          text(
            'trackLabel',
            'Small label above the photos, e.g. "Photos · scroll at your own pace".',
          ),
          {
            name: 'pieces',
            label: 'Photos',
            type: 'relationship',
            relationTo: 'portfolio-items',
            hasMany: true,
            maxRows: 12,
            admin: {
              description:
                'The pieces in the photo gallery, in this order. Leave empty to show the first 9 of the portfolio.',
            },
          },
        ]),
        section(
          'films',
          'Films',
          [
            text('trackLabel', 'Small label above the films.'),
            {
              type: 'row',
              fields: [
                {
                  name: 'itemLabel',
                  type: 'text',
                  admin: { width: '50%', description: 'Top of each card, e.g. "Tisi / film".' },
                },
                {
                  name: 'watchLabel',
                  type: 'text',
                  defaultValue: 'Watch the tattoo video',
                  admin: { width: '50%', description: 'Link at the bottom of each card.' },
                },
              ],
            },
            {
              name: 'pieces',
              label: 'Films',
              type: 'relationship',
              relationTo: 'portfolio-items',
              hasMany: true,
              maxRows: 12,
              filterOptions: { video: { exists: true } },
              admin: {
                description:
                  'Pieces with a video, in this order. Each card shows the video cover and opens the piece’s page. Leave empty to hide the films.',
              },
            },
          ],
          'A second gallery under the photos.',
        ),
      ],
    },
    {
      label: 'Artist',
      fields: [
        section('meetArtist', 'Meet the artist', [
          tagField(),
          styledHeading(),
          {
            name: 'artist',
            type: 'relationship',
            relationTo: 'artists',
            required: true,
            admin: { description: 'The artist whose portrait is shown.' },
          },
          image('image', 'Image', 'Optional. Replaces the artist portrait here.', false),
          text('imageNote', 'Small note on the image, e.g. "Original work by Tisi". Optional.'),
          paragraphs('text', 'A short introduction. Leave an empty line between paragraphs.'),
          optionalLink('button', 'Button'),
          paragraphs('signoff', 'Small text next to the asterisk. Optional.'),
        ]),
      ],
    },
    {
      label: 'Visiting',
      fields: [
        section('visit', 'Visiting Albania', [
          tagField(),
          styledHeading(),
          paragraphs('text'),
          optionalLink('button', 'Orange button'),
          steps,
          optionalLink('link', 'Link under the steps'),
        ]),
      ],
    },
    {
      label: 'Plan',
      fields: [
        section('plan', 'From idea to appointment', [
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          {
            name: 'cards',
            type: 'array',
            maxRows: 3,
            labels: { singular: 'Card', plural: 'Cards' },
            admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'label', type: 'text', admin: { width: '40%' } },
                  {
                    name: 'icon',
                    type: 'select',
                    required: true,
                    defaultValue: 'sketch',
                    admin: { width: '20%' },
                    options: [
                      { label: 'Sketch', value: 'sketch' },
                      { label: 'Machine', value: 'machine' },
                      { label: 'Ink', value: 'ink' },
                    ],
                  },
                  { name: 'title', type: 'text', required: true, admin: { width: '40%' } },
                ],
              },
              { name: 'text', type: 'textarea', required: true },
            ],
          },
          {
            name: 'priceNote',
            label: 'Price note',
            type: 'group',
            fields: [
              text('title', 'Bold start of the note, e.g. a question.'),
              { name: 'text', type: 'textarea' },
              optionalLink('link', 'Link'),
            ],
          },
        ]),
      ],
    },
    {
      label: 'Enquiry',
      fields: [
        section(
          'enquiry',
          'Enquiry form',
          [
            tagField(),
            styledHeading(),
            paragraphs('intro'),
            paragraphs(
              'detailText',
              'Under the studio name and city, e.g. "Tattoo artist: Tisi · 18 years of experience."',
            ),
            optionalLink('contactLink', 'Link under the details'),
          ],
          'The form itself (button, notes) is edited in Pages → Contact.',
        ),
      ],
    },
    {
      label: 'FAQ & journal',
      fields: [
        section(
          'faq',
          'FAQ',
          [tagField(), styledHeading()],
          'Shows the FAQs set to appear on the homepage (Studio → FAQs).',
        ),
        section('journal', 'Journal', [tagField(), styledHeading(), optionalLink('link', 'Link')]),
      ],
    },
    {
      label: 'Closing',
      fields: [
        section('finalCta', 'Closing call to action', [
          tagField(),
          styledHeading(),
          linkGroup({ name: 'button', label: 'Orange button' }),
        ]),
        linkGroup({
          name: 'mobileCta',
          label: 'Mobile button',
          description: 'The orange bar pinned to the bottom of the screen on phones.',
        }),
      ],
    },
  ],
})
