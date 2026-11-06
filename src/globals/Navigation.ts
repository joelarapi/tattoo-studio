import type { ArrayField, GlobalConfig, TextFieldSingleValidation } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { linkGroup, validateHref } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

// A plain menu link needs a destination; the styles dropdown doesn't.
const headerHref: TextFieldSingleValidation = (value, options) => {
  const type = (options.siblingData as { type?: string }).type
  if (type !== 'styles' && !value) return 'Add where this item links to.'
  return validateHref(value, options)
}

const linkList = (name: string, description?: string): ArrayField => ({
  name,
  type: 'array',
  labels: { singular: 'Link', plural: 'Links' },
  admin: {
    description,
    components: { RowLabel: '/components/admin/RowLabel#LinkRowLabel' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
          validate: validateHref,
          admin: { width: '50%' },
        },
      ],
    },
  ],
})

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  admin: {
    group: 'Settings',
    description: 'The links in the top menu and the footer.',
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: { afterChange: [revalidateGlobal({ global: 'navigation' })] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'header',
          label: 'Top menu',
          fields: [
            {
              name: 'links',
              type: 'array',
              maxRows: 7,
              labels: { singular: 'Menu item', plural: 'Menu items' },
              admin: {
                description: 'Shown left to right. Keep labels to one word where possible.',
                components: { RowLabel: '/components/admin/RowLabel#LinkRowLabel' },
              },
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  defaultValue: 'link',
                  options: [
                    { label: 'Link', value: 'link' },
                    { label: 'Styles dropdown (lists every tattoo style)', value: 'styles' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'href',
                      label: 'Link',
                      type: 'text',
                      validate: headerHref,
                      admin: {
                        width: '50%',
                        condition: (_, siblingData) => siblingData?.type !== 'styles',
                      },
                    },
                  ],
                },
              ],
            },
            linkGroup({ name: 'cta', label: 'Menu button', description: 'The orange button.' }),
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: [
            {
              name: 'columns',
              type: 'array',
              maxRows: 3,
              labels: { singular: 'Column', plural: 'Columns' },
              admin: {
                description:
                  'Link columns. The newsletter and contact columns are added automatically.',
                components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'links',
                      required: true,
                      admin: { width: '50%' },
                      options: [
                        { label: 'Links I choose', value: 'links' },
                        { label: 'All tattoo styles (automatic)', value: 'styles' },
                      ],
                    },
                  ],
                },
                {
                  ...linkList('links'),
                  admin: {
                    ...linkList('links').admin,
                    condition: (_, siblingData) => siblingData?.type === 'links',
                  },
                },
              ],
            },
            {
              name: 'newsletter',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
                { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Subscribe' },
                {
                  name: 'consentLabel',
                  type: 'text',
                  required: true,
                  admin: { description: 'Text next to the consent checkbox.' },
                },
              ],
            },
            { name: 'contactTitle', type: 'text', required: true, defaultValue: 'Contact' },
            {
              name: 'legalLine',
              type: 'text',
              admin: {
                description: 'e.g. "© {year} Studio Name". {year} becomes the current year.',
              },
            },
            linkList('legalLinks', 'Small links at the very bottom, e.g. Privacy and Cookies.'),
          ],
        },
      ],
    },
  ],
}
