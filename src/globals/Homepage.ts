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
        section(
          'work',
          'Portfolio',
          [
            tagField(),
            styledHeading(),
            paragraphs('intro', 'Next to the heading. Enter for a line break.'),
            optionalLink('button', 'Button'),
            text(
              'trackLabel',
              'Small label above the gallery, e.g. "Photos · scroll at your own pace".',
            ),
            paragraphs('closingText', 'Line under the gallery. Optional.'),
            optionalLink('closingLink', 'Link under the gallery'),
          ],
          'Shows the portfolio pieces marked "Featured" (or all of them if none are).',
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
          paragraphs('text', 'A short introduction. Leave an empty line between paragraphs.'),
          optionalLink('button', 'Button'),
          paragraphs('signoff', 'Small text next to the asterisk. Enter for a line break.'),
        ]),
      ],
    },
    {
      label: 'Films',
      fields: [
        section(
          'reels',
          'Video portfolio',
          [
            tagField(),
            styledHeading(),
            paragraphs('intro', 'Next to the heading. Enter for a line break.'),
            text('trackLabel', 'Small label above the films.'),
            {
              type: 'row',
              fields: [
                {
                  name: 'itemLabel',
                  type: 'text',
                  defaultValue: 'Film',
                  admin: {
                    width: '33%',
                    description: 'After the number on each card: "01 / Film".',
                  },
                },
                {
                  name: 'watchLabel',
                  type: 'text',
                  defaultValue: 'Watch the film',
                  admin: { width: '33%', description: 'Card link when there is a video.' },
                },
                {
                  name: 'comingSoonLabel',
                  type: 'text',
                  defaultValue: 'Footage to come',
                  admin: { width: '34%', description: 'Card link when there is no video yet.' },
                },
              ],
            },
            {
              name: 'items',
              label: 'Films',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Film', plural: 'Films' },
              admin: { components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
              fields: [
                { name: 'title', type: 'text', required: true },
                image('poster', 'Cover image', 'Portrait format (3:4).'),
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'video' } },
                  admin: {
                    description:
                      'MP4 or WebM, max 8 MB. Without a video, the card opens the text below.',
                  },
                },
                paragraphs('text', 'Shown in the pop-up while there is no video.'),
              ],
            },
            optionalLink('dialogLink', 'Link in the pop-up'),
          ],
          'Leave "Films" empty to hide this section.',
        ),
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
