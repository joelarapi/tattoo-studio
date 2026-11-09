import type { ArrayField, Field } from 'payload'

import { cardList, optionalLink, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { linkGroup } from '@/fields/link'
import { basicEditor } from '@/fields/richText'

import { pageGlobal } from './pageGlobal'

const navLabel = text(
  'navLabel',
  'The jump link to this section at the top of the page, e.g. "Plan your visit". Leave empty to leave it out.',
)

const rows = (
  name: string,
  label: string,
  fields: Field[],
  maxRows?: number,
  description?: string,
): ArrayField => ({
  name,
  label,
  type: 'array',
  maxRows,
  admin: { description, components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' } },
  fields,
})

export const VisitingPage = pageGlobal({
  slug: 'visiting-page',
  label: 'Visiting Albania',
  description: 'The travel guide for visitors coming to Albania for a tattoo.',
  tabs: [
    {
      label: 'Hero',
      fields: [
        section('hero', 'Top of the page', [
          tagField(),
          styledHeading({ description: 'The page title (H1). White, then grey, then orange.' }),
          paragraphs('intro'),
          linkGroup({ name: 'button', label: 'Orange button' }),
          paragraphs('note', 'Small print under the button. Optional.'),
          section('route', 'Trip outline (the box on the right)', [
            text('title', 'Small label at the top of the box.'),
            rows(
              'stops',
              'Stops',
              [
                text('label', 'e.g. "Arrive"'),
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'text' },
              ],
              4,
            ),
            text('footnote', 'Small label at the bottom of the box.'),
          ]),
        ]),
      ],
    },
    {
      label: 'Plan',
      fields: [
        section('plan', 'Plan your visit', [
          navLabel,
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          cardList({ maxRows: 3, link: true }),
        ]),
      ],
    },
    {
      label: 'Stay',
      fields: [
        section('stay', 'Hotels and transport', [
          navLabel,
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          rows(
            'cards',
            'Cards',
            [
              {
                type: 'row',
                fields: [
                  {
                    name: 'symbol',
                    type: 'select',
                    required: true,
                    defaultValue: 'home',
                    admin: { width: '30%' },
                    options: [
                      { label: 'House', value: 'home' },
                      { label: 'Arrow', value: 'arrow' },
                    ],
                  },
                  {
                    name: 'tag',
                    type: 'text',
                    admin: { width: '70%', description: 'Small orange label.' },
                  },
                ],
              },
              { name: 'title', type: 'text', required: true },
              paragraphs('text'),
              {
                name: 'bullets',
                label: 'Checklist',
                type: 'textarea',
                admin: { description: 'One item per line.' },
              },
              optionalLink('button', 'Button'),
            ],
            2,
          ),
          paragraphs('notice', 'The boxed note under the cards. Optional.'),
          section('arrival', 'Arrival note', [
            text('title'),
            { name: 'text', type: 'richText', editor: basicEditor },
          ]),
        ]),
      ],
    },
    {
      label: 'Explore',
      fields: [
        section('explore', 'Explore Albania', [
          navLabel,
          tagField(),
          styledHeading(),
          paragraphs('intro', 'Next to the heading. Enter for a line break.'),
          rows(
            'destinations',
            'Places',
            [
              {
                type: 'row',
                fields: [
                  {
                    name: 'motif',
                    label: 'Graphic',
                    type: 'select',
                    required: true,
                    defaultValue: 'columns',
                    admin: { width: '30%' },
                    options: [
                      { label: 'Columns (history)', value: 'columns' },
                      { label: 'Windows (old town)', value: 'windows' },
                      { label: 'Waves (coast)', value: 'waves' },
                    ],
                  },
                  {
                    name: 'tag',
                    type: 'text',
                    admin: { width: '70%', description: 'Small orange label.' },
                  },
                ],
              },
              { name: 'title', type: 'text', required: true },
              paragraphs('text'),
              optionalLink('link', 'Link'),
            ],
            6,
          ),
          paragraphs('note', 'Small print under the places. Optional.'),
          section('slow', 'Slow-travel note', [
            tagField(),
            { name: 'title', type: 'textarea', admin: { rows: 2 } },
            paragraphs(),
          ]),
        ]),
      ],
    },
    {
      label: 'Itinerary',
      fields: [
        section('itinerary', 'Trip outline', [
          tagField(),
          styledHeading(),
          paragraphs(),
          rows(
            'items',
            'Steps',
            [
              text('label', 'e.g. "Before you travel"'),
              { name: 'title', type: 'text', required: true },
              { name: 'text', type: 'textarea' },
            ],
            5,
          ),
        ]),
      ],
    },
    {
      label: 'Questions',
      fields: [
        section(
          'questions',
          'Questions',
          [navLabel, tagField(), styledHeading()],
          'Shows the FAQs set to appear on Visiting Albania (Studio → FAQs).',
        ),
        section('endCta', 'Closing call to action', [
          tagField(),
          styledHeading(),
          paragraphs(),
          linkGroup({ name: 'button', label: 'Orange button' }),
          paragraphs('note', 'Small print under the button. Optional.'),
        ]),
      ],
    },
  ],
})
