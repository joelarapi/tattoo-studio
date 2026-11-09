import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access'
import { leadStatusOptions, MAX_LEAD_FILES } from '@/lib/leads'

/** Keeps the full name in one column for the list view, search and the document title. */
const fullName: CollectionBeforeChangeHook = ({ data }) => {
  const name = [data.firstName, data.surname].filter(Boolean).join(' ').trim()
  return name ? { ...data, name } : data
}

/*
 * Tattoo enquiries from the website form. The form's server action (lead-capture phase) saves
 * them with the trusted Local API, so the public REST API can't create leads (no spam route around
 * Turnstile). Editors can read leads; only admins can change or delete them.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Tattoo enquiry', plural: 'Tattoo enquiries' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'placement', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description:
      'Every enquiry from the website, newest first. Filter by status, travel or ad campaign.',
  },
  defaultSort: '-createdAt',
  access: {
    read: isAdminOrEditor,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: { beforeChange: [fullName] },
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
      name: 'name',
      type: 'text',
      admin: { hidden: true, readOnly: true },
    },
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'surname', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          label: 'Phone / WhatsApp',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        { name: 'email', type: 'email', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'placement', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'preferredTiming', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'description', label: 'Their idea', type: 'textarea', required: true },
    {
      name: 'project',
      label: 'Inspired by',
      type: 'relationship',
      relationTo: 'portfolio-items',
      admin: { description: 'The portfolio piece they came from, if any.' },
    },
    {
      name: 'references',
      label: 'Reference files',
      type: 'upload',
      relationTo: 'lead-attachments',
      hasMany: true,
      maxRows: MAX_LEAD_FILES,
    },
    {
      name: 'travel',
      type: 'group',
      admin: { description: 'Filled in when they are travelling to Albania from abroad.' },
      fields: [
        { name: 'travelling', label: 'Travelling from abroad', type: 'checkbox', index: true },
        {
          type: 'row',
          fields: [
            { name: 'from', label: 'Travelling from', type: 'text', admin: { width: '50%' } },
            { name: 'dates', label: 'Dates in Albania', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'help', label: 'Hotel or transport help', type: 'textarea' },
      ],
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
