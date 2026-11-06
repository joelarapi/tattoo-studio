import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access'
import { leadStatusOptions, tattooSizeOptions } from '@/lib/leads'

/*
 * Booking requests from the consultation form. The form's server action saves them with the
 * trusted Local API, so the public REST API can't create leads (no spam route around Turnstile).
 * Editors can read leads; only admins can change or delete them.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Booking request', plural: 'Booking requests' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'style', 'preferredArtist', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description:
      'Every consultation request from the website, newest first. Filter by status, style or ad campaign.',
  },
  defaultSort: '-createdAt',
  access: {
    read: isAdminOrEditor,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: leadStatusOptions.map((option) => ({ ...option })),
      defaultValue: 'new',
      required: true,
      index: true,
      admin: { position: 'sidebar', description: 'Track follow-up. Only admins can change this.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        {
          name: 'phone',
          label: 'Phone / WhatsApp',
          type: 'text',
          required: true,
          admin: { width: '33%' },
        },
        { name: 'email', type: 'email', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'relationship',
          relationTo: 'styles',
          admin: { width: '33%' },
        },
        {
          name: 'preferredArtist',
          type: 'relationship',
          relationTo: 'artists',
          admin: { width: '33%' },
        },
        {
          name: 'size',
          label: 'Approximate size',
          type: 'select',
          options: tattooSizeOptions.map((option) => ({ ...option })),
          admin: { width: '33%' },
        },
      ],
    },
    { name: 'placement', type: 'text' },
    { name: 'description', label: 'Their idea', type: 'textarea' },
    {
      name: 'referenceImage',
      type: 'upload',
      relationTo: 'lead-attachments',
    },
    {
      name: 'marketingConsent',
      label: 'Agreed to marketing messages',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'attribution',
      type: 'group',
      admin: {
        description:
          'Where the visit came from, captured automatically from ad links (Google Ads, Meta).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', label: 'utm_source', type: 'text', index: true },
            { name: 'utmMedium', label: 'utm_medium', type: 'text' },
            { name: 'utmCampaign', label: 'utm_campaign', type: 'text', index: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmTerm', label: 'utm_term', type: 'text' },
            { name: 'utmContent', label: 'utm_content', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'gclid', label: 'Google click ID (gclid)', type: 'text' },
            { name: 'fbclid', label: 'Meta click ID (fbclid)', type: 'text' },
          ],
        },
        { name: 'landingPage', type: 'text', admin: { description: 'First page they visited.' } },
        { name: 'referrer', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
