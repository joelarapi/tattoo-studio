import type { Block, Condition } from 'payload'

import { optionalLink, paragraphs, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'

import { sectionSettings } from '../settings'

const side =
  (value: 'text' | 'details'): Condition =>
  (_, siblingData) =>
    (siblingData?.side ?? 'text') === value

export const EnquiryBlock: Block = {
  slug: 'enquiry',
  interfaceName: 'EnquiryBlock',
  labels: { singular: 'Enquiry form', plural: 'Enquiry forms' },
  admin: { group: 'Contact and calls to action' },
  fields: [
    tagField(),
    styledHeading({
      description:
        'White, then grey, then orange. If this is the first section of the page, it is the page title.',
    }),
    paragraphs('intro'),
    {
      name: 'side',
      label: 'Under the intro',
      type: 'select',
      defaultValue: 'text',
      options: [
        { label: 'The studio name and a short text', value: 'text' },
        { label: 'Address, opening hours and contact details', value: 'details' },
      ],
      admin: {
        isClearable: false,
        description:
          'The details come from Settings → Studio details. The form’s button and notes are in Studio details → Enquiry form.',
      },
    },
    {
      ...paragraphs(
        'detailText',
        'Under the studio name and city, e.g. "Tattoo artist: Tisi · 18 years of experience."',
      ),
      admin: {
        description:
          'Under the studio name and city, e.g. "Tattoo artist: Tisi · 18 years of experience."',
        condition: side('text'),
      },
    },
    {
      ...optionalLink('contactLink', 'Link under the details'),
      admin: { condition: side('text') },
    },
    {
      type: 'row',
      admin: { condition: side('details') },
      fields: [
        {
          ...text('studioLabel', 'Label above the address, e.g. "The studio".'),
          admin: { width: '50%', description: 'Label above the address, e.g. "The studio".' },
        },
        {
          ...text('directLabel', 'Label above phone and email, e.g. "Direct contact".'),
          admin: {
            width: '50%',
            description: 'Label above phone and email, e.g. "Direct contact".',
          },
        },
      ],
    },
    {
      ...paragraphs('notice', 'A boxed note under the details. Optional.'),
      admin: {
        description: 'A boxed note under the details. Optional.',
        condition: side('details'),
      },
    },
    sectionSettings(),
  ],
}
