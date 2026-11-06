import type { Field, GlobalConfig, GroupField } from 'payload'

import { adminFieldAccess, isAdminOrEditor, publishedOrLoggedIn } from '@/access'
import { iconField } from '@/fields/icon'
import { linkGroup } from '@/fields/link'
import { basicEditor } from '@/fields/richText'
import { revalidateGlobal } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'

/** One homepage section's copy, shown as a titled box in the admin. */
const section = (
  name: string,
  label: string,
  fields: Field[],
  description?: string,
): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description },
  fields,
})

const eyebrow: Field = {
  name: 'eyebrow',
  type: 'text',
  admin: { description: 'Small uppercase label above the heading. Keep it to a few words.' },
}

const heading = (description?: string): Field => ({
  name: 'heading',
  type: 'text',
  required: true,
  admin: { description },
})

/*
 * Every homepage text, in page order. The SEO tab is added by the SEO plugin (src/plugins/seo.ts),
 * which is why the first field is the tabs field.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Content',
    description:
      'All homepage text, section by section. Changes autosave as a draft; press Publish to put them live.',
    livePreview: { url: () => generatePreviewPath('/') },
    preview: () => generatePreviewPath('/'),
  },
  access: {
    read: publishedOrLoggedIn,
    update: isAdminOrEditor,
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
    max: 50,
  },
  hooks: { afterChange: [revalidateGlobal({ global: 'homepage', paths: ['/'] })] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            section('hero', 'Hero (top of the page)', [
              eyebrow,
              linkGroup({ name: 'eyebrowLink', label: 'Link next to the label' }),
              heading(
                'The main headline (the page’s H1). Short and memorable; Google reads it first.',
              ),
              {
                name: 'intro',
                type: 'textarea',
                required: true,
                admin: { description: 'One or two sentences under the headline.' },
              },
              linkGroup({ name: 'cta', label: 'Main button' }),
              {
                name: 'scrollLabel',
                type: 'text',
                defaultValue: 'Scroll to begin',
                admin: { description: 'The small hint at the bottom of the hero.' },
              },
              {
                name: 'poster',
                label: 'Process animation still (optional)',
                type: 'upload',
                relationTo: 'media',
                filterOptions: { mimeType: { contains: 'image' } },
                admin: {
                  description:
                    'Replaces the first frame of the process animation, shown while it loads. Black background, 16:9.',
                },
              },
            ]),
          ],
        },
        {
          label: 'Process',
          fields: [
            section(
              'process',
              'The process (scroll animation)',
              [
                heading('Section heading, e.g. "From idea to healed".'),
                {
                  name: 'sequence',
                  type: 'text',
                  defaultValue: 'placeholder',
                  access: { update: adminFieldAccess },
                  admin: {
                    description:
                      'Technical: the animation’s folder name. Set by the developer when new footage arrives.',
                  },
                },
                {
                  name: 'steps',
                  type: 'array',
                  minRows: 4,
                  maxRows: 4,
                  required: true,
                  labels: { singular: 'Step', plural: 'Steps' },
                  admin: {
                    description: 'Exactly four steps; they’re numbered 01–04 automatically.',
                    initCollapsed: true,
                    components: { RowLabel: '/components/admin/RowLabel#HeadingRowLabel' },
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: { description: 'Optional small label, e.g. "Week 1".' },
                    },
                    { name: 'heading', type: 'text', required: true },
                    { name: 'text', type: 'textarea', required: true },
                  ],
                },
              ],
              'Four steps that scroll past while the animation plays.',
            ),
          ],
        },
        {
          label: 'Work & styles',
          fields: [
            section(
              'featuredWork',
              'Featured work slider',
              [eyebrow, heading(), { name: 'intro', type: 'textarea' }],
              'Shows portfolio pieces marked "Featured".',
            ),
            section(
              'styles',
              'Styles grid',
              [heading('e.g. "What we tattoo"'), linkGroup({ name: 'button', label: 'Button' })],
              'Shows the 4 styles marked "Show on homepage".',
            ),
          ],
        },
        {
          label: 'Numbers & statement',
          fields: [
            section('numbers', 'Studio in numbers', [
              eyebrow,
              heading(),
              {
                name: 'stats',
                type: 'array',
                minRows: 1,
                maxRows: 6,
                labels: { singular: 'Stat', plural: 'Stats' },
                admin: {
                  description:
                    'Real figures only. The seeded numbers are placeholders: replace them before launch.',
                  initCollapsed: true,
                  components: { RowLabel: '/components/admin/RowLabel#StatRowLabel' },
                },
                fields: [
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'value',
                        type: 'number',
                        required: true,
                        admin: { width: '33%', description: 'e.g. 4.9' },
                      },
                      {
                        name: 'unit',
                        type: 'text',
                        admin: { width: '33%', description: 'Optional, e.g. "+" or "★".' },
                      },
                    ],
                  },
                  {
                    name: 'text',
                    type: 'text',
                    required: true,
                    admin: {
                      description: 'The rest of the sentence, e.g. "average Google rating".',
                    },
                  },
                  {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    filterOptions: { mimeType: { contains: 'image' } },
                  },
                ],
              },
            ]),
            section('statement', 'Statement', [
              eyebrow,
              {
                type: 'row',
                fields: [
                  { name: 'headingLine1', type: 'text', required: true, admin: { width: '50%' } },
                  { name: 'headingLine2', type: 'text', admin: { width: '50%' } },
                ],
              },
              { name: 'text', type: 'textarea' },
              linkGroup({ name: 'secondaryButton', label: 'Dark button' }),
              linkGroup({ name: 'primaryButton', label: 'Orange button' }),
            ]),
          ],
        },
        {
          label: 'Artists & standards',
          fields: [
            section(
              'artists',
              'Meet the artists',
              [
                eyebrow,
                heading(),
                {
                  name: 'headingMuted',
                  type: 'text',
                  admin: { description: 'A second sentence, shown in grey after the heading.' },
                },
              ],
              'Shows artists marked "Show on homepage".',
            ),
            section('standards', 'Our standards', [
              eyebrow,
              heading(),
              {
                name: 'items',
                type: 'array',
                minRows: 4,
                maxRows: 4,
                labels: { singular: 'Standard', plural: 'Standards' },
                admin: {
                  description: 'Four promises. Only publish what is true for the studio.',
                  initCollapsed: true,
                  components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' },
                },
                fields: [
                  iconField(),
                  { name: 'title', type: 'text', required: true },
                  { name: 'text', type: 'textarea', required: true },
                ],
              },
            ]),
          ],
        },
        {
          label: 'Journal & FAQ',
          fields: [
            section(
              'journal',
              'Latest from the journal',
              [eyebrow, heading(), linkGroup({ name: 'button', label: 'Button' })],
              'Shows the three newest published posts.',
            ),
            section('faq', 'FAQ', [eyebrow, heading()], 'Shows FAQs marked "Show on homepage".'),
          ],
        },
        {
          label: 'Booking',
          fields: [
            section('booking', 'Booking form', [
              eyebrow,
              heading('e.g. "Ready when you are"'),
              { name: 'intro', type: 'textarea' },
              { name: 'submitLabel', type: 'text', required: true, defaultValue: 'Send request' },
              {
                name: 'privacyNote',
                type: 'richText',
                editor: basicEditor,
                admin: { description: 'Short note under the form. Link to the privacy policy.' },
              },
              {
                type: 'row',
                fields: [
                  { name: 'successHeading', type: 'text', required: true, admin: { width: '50%' } },
                  { name: 'successMessage', type: 'textarea', admin: { width: '50%' } },
                ],
              },
              {
                name: 'redirectToThankYou',
                label: 'Send people to the /thank-you page after they submit',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  description: 'Turn on if your ad campaigns count conversions by page visit.',
                },
              },
            ]),
          ],
        },
      ],
    },
  ],
}
