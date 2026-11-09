import type { GlobalConfig, TextFieldSingleValidation } from 'payload'

import { adminFieldAccess, anyone, isAdminOrEditor } from '@/access'
import { paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { linkGroup } from '@/fields/link'
import { basicEditor } from '@/fields/richText'
import { revalidateGlobal } from '@/hooks/revalidate'

const time: TextFieldSingleValidation = (value) =>
  !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || 'Use 24-hour time, e.g. 10:00 or 19:30.'

const url: TextFieldSingleValidation = (value) =>
  !value || /^https:\/\//.test(value) || 'Paste the full address, starting with https://'

const days = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' },
]

/*
 * Business facts. Google shows these (address, hours, phone) in search and Maps, so they must
 * match the Google Business Profile exactly.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Studio details',
  admin: {
    group: 'Settings',
    description:
      'Name, address, opening hours and contact details. These must match your Google Business Profile exactly.',
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: { afterChange: [revalidateGlobal({ global: 'site-settings' })] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Studio',
          fields: [
            { name: 'studioName', type: 'text', required: true },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                description:
                  'Optional. Leave empty to use the built-in wordmark, made from the studio name (first word on top).',
              },
            },
            {
              name: 'brandParagraph',
              label: 'Footer tagline',
              type: 'textarea',
              admin: { description: 'Short line under the city in the footer.' },
            },
            {
              name: 'monochromePhotos',
              label: 'Show photos in black and white',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'The design shows every photo in black and white. Untick to show them in colour.',
              },
            },
            {
              name: 'priceRange',
              type: 'text',
              admin: { description: 'For Google, e.g. "€€" or "From €80".' },
            },
          ],
        },
        {
          label: 'Contact & hours',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  admin: { description: 'Leave empty until the address is confirmed.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', required: true, admin: { width: '33%' } },
                    { name: 'postcode', type: 'text', admin: { width: '33%' } },
                    { name: 'country', type: 'text', required: true, admin: { width: '33%' } },
                  ],
                },
              ],
            },
            {
              name: 'geo',
              label: 'Map position',
              type: 'group',
              admin: {
                description:
                  'In Google Maps, right-click the studio and click the numbers at the top to copy them.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lat', label: 'Latitude', type: 'number', admin: { width: '50%' } },
                    { name: 'lng', label: 'Longitude', type: 'number', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true, admin: { width: '33%' } },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp number',
                  type: 'text',
                  admin: { width: '33%', description: 'International format, e.g. +355 69 …' },
                },
                { name: 'email', type: 'email', required: true, admin: { width: '33%' } },
              ],
            },
            { name: 'googleMapsUrl', label: 'Google Maps link', type: 'text', validate: url },
            {
              name: 'openingHours',
              type: 'array',
              labels: { singular: 'Opening time', plural: 'Opening hours' },
              admin: {
                description:
                  'One row per set of days with the same hours. Days not listed show as closed.',
              },
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: days,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'opens',
                      type: 'text',
                      required: true,
                      validate: time,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'closes',
                      type: 'text',
                      required: true,
                      validate: time,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              admin: {
                components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '33%' },
                      options: [
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Pinterest', value: 'pinterest' },
                        { label: 'X', value: 'x' },
                        { label: 'Google Business Profile', value: 'google' },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      validate: url,
                      admin: { width: '66%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Shared sections',
          fields: [
            section(
              'endCta',
              'Closing call to action',
              [
                tagField(),
                styledHeading(),
                linkGroup({ name: 'button', label: 'Orange button' }),
                paragraphs('note', 'Small print under the button. Optional.'),
              ],
              'Used by every "Call to action" section set to "The shared one", and under every journal article.',
            ),
            section(
              'notFound',
              'Page not found',
              [styledHeading(), paragraphs(), linkGroup({ name: 'button', label: 'Button' })],
              'Shown when a link leads nowhere.',
            ),
          ],
        },
        {
          label: 'Enquiry form',
          fields: [
            section(
              'enquiryForm',
              'Enquiry form',
              [
                text('submitLabel', 'The button, e.g. "Send your tattoo idea".', true),
                paragraphs('helperText', 'Small text under the button. Optional.'),
                {
                  name: 'privacyNote',
                  type: 'richText',
                  editor: basicEditor,
                  admin: { description: 'Short note with a link to the privacy policy.' },
                },
                paragraphs(
                  'pendingNotice',
                  'Shown when someone presses the button while sending is not connected yet.',
                  true,
                ),
                text(
                  'successHeading',
                  'Shown after a successful enquiry (once sending is connected).',
                ),
                paragraphs('successMessage', 'Under the success heading.'),
              ],
              'Used by every "Enquiry form" section. The field labels are part of the design.',
            ),
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'titleTemplate',
                  type: 'text',
                  required: true,
                  defaultValue: '%s | Studio',
                  validate: (value: string | null | undefined) =>
                    !value || value.includes('%s') || 'Include %s where the page title goes.',
                  admin: {
                    description:
                      'How page titles look in Google. %s is replaced by the page title, e.g. "%s | Studio Name".',
                  },
                },
                {
                  name: 'description',
                  label: 'Default description',
                  type: 'textarea',
                  required: true,
                  maxLength: 160,
                  admin: {
                    description: 'Used when a page has no description of its own. Max 160.',
                  },
                },
                {
                  name: 'ogImage',
                  label: 'Default share image',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'image' } },
                  admin: { description: 'Shown when a page without its own image is shared.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Tracking',
          description: 'Only admins can change these.',
          fields: [
            {
              name: 'tracking',
              type: 'group',
              label: false,
              access: { update: adminFieldAccess },
              fields: [
                {
                  name: 'gtmId',
                  label: 'Google Tag Manager ID',
                  type: 'text',
                  validate: (value: string | null | undefined) =>
                    !value || /^GTM-[A-Z0-9]+$/.test(value) || 'Looks like GTM-XXXXXXX',
                },
                {
                  name: 'metaPixelId',
                  label: 'Meta Pixel ID',
                  type: 'text',
                  validate: (value: string | null | undefined) =>
                    !value || /^\d{10,20}$/.test(value) || 'A number of 10–20 digits.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
