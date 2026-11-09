import type { ArrayField, Field, GroupField, TextareaField, TextField, UploadField } from 'payload'

import { styledHeading } from './heading'
import { linkGroup, validateHref } from './link'

/*
 * Building blocks for the page globals. Labels are typed in normal case; the site shows them in
 * capitals. Card numbers ("01 / …") are added by the site, so editors never type them.
 */

/** One section's copy, shown as a titled box in the admin. */
export const section = (
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

export const tagField = (
  description = 'Small orange label above the heading. A few words.',
): TextField => ({
  name: 'tag',
  label: 'Label',
  type: 'text',
  admin: { description },
})

export const text = (name: string, description?: string, required = false): TextField => ({
  name,
  type: 'text',
  required,
  admin: { description },
})

/** Plain text in paragraphs: a blank line starts a new paragraph, Enter a new line. */
export const paragraphs = (
  name = 'text',
  description = 'Leave an empty line between paragraphs.',
  required = false,
): TextareaField => ({
  name,
  type: 'textarea',
  required,
  admin: { description },
})

export const optionalLink = (name: string, label: string, description?: string) =>
  linkGroup({ name, label, description, required: false })

/** An image from the media library. */
export const image = (
  name: string,
  label: string,
  description?: string,
  required = true,
): UploadField => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  required,
  filterOptions: { mimeType: { contains: 'image' } },
  admin: { description },
})

/** A photo behind the top of a page, darkened so the heading stays readable. */
export const heroBackground = (): UploadField =>
  image(
    'background',
    'Background photo',
    'Optional. Shown in colour, darkened, behind the heading.',
    false,
  )

/** The top of an inner page: a boxed label, the H1, a short intro and a small index line. */
export const pageHero = (extra: Field[] = []): GroupField =>
  section('hero', 'Top of the page', [
    tagField('Small label in a box above the title.'),
    styledHeading({ description: 'The page title (H1). White, then grey, then orange.' }),
    paragraphs('intro', 'Under the title. Enter for a line break.'),
    ...extra,
    text('indexLabel', 'Tiny line at the bottom, e.g. "01 / About us".'),
    heroBackground(),
  ])

/** A plain list of links (label + where it goes). */
export const linkList = (name: string, description?: string, maxRows?: number): ArrayField => ({
  name,
  type: 'array',
  maxRows,
  labels: { singular: 'Link', plural: 'Links' },
  admin: {
    description,
    components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
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

type CardListArgs = {
  name?: string
  label?: string
  maxRows?: number
  description?: string
  /** Each card gets an optional link under its text. */
  link?: boolean
  /** Extra fields per card. */
  extra?: Field[]
}

/** Numbered cards: an optional small label, a title and a short text. */
export function cardList({
  name = 'cards',
  label = 'Cards',
  maxRows,
  description,
  link = false,
  extra = [],
}: CardListArgs = {}): ArrayField {
  return {
    name,
    label,
    type: 'array',
    maxRows,
    labels: { singular: 'Card', plural: 'Cards' },
    admin: {
      description,
      components: { RowLabel: '/components/admin/RowLabel#ItemRowLabel' },
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            admin: { width: '40%', description: 'Small label after the number, e.g. "Your idea".' },
          },
          {
            name: 'title',
            type: 'textarea',
            required: true,
            admin: { width: '60%', rows: 2 },
          },
        ],
      },
      ...extra,
      paragraphs('text', 'Leave an empty line between paragraphs.', true),
      ...(link ? [optionalLink('link', 'Link')] : []),
    ],
  }
}
