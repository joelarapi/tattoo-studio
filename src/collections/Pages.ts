import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionConfig,
  slugField,
  type TextField,
  type TextFieldSingleValidation,
} from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '@/access'
import { pageBlockSlugs } from '@/blocks'
import { validateLayout } from '@/blocks/validate'
import { linkGroup } from '@/fields/link'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'
import { pathForDoc, RESERVED_PAGE_SLUGS, SYSTEM_PAGE_SLUGS } from '@/lib/routes'

const pagePath = (slug?: string | null) => pathForDoc('pages', slug)

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'pages',
  paths: (doc) => (doc.slug ? [pagePath(doc.slug)] : []),
})

const validateSlug: TextFieldSingleValidation = (value) => {
  if (!value) return 'Give the page an address, e.g. "aftercare".'
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
    return 'Use lowercase letters, numbers and dashes, e.g. "aftercare".'
  }
  if (RESERVED_PAGE_SLUGS.includes(value)) {
    return `"${value}" is used by the site itself. Choose another address.`
  }
  return true
}

const isSystemPage = (slug: unknown) => typeof slug === 'string' && SYSTEM_PAGE_SLUGS.includes(slug)

const protectSystemPages: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const page = await req.payload.findByID({ collection: 'pages', id, depth: 0, req })
  if (isSystemPage(page?.slug)) {
    throw new APIError(
      `"${page.title}" can't be deleted: the site needs it. Change its sections instead.`,
      400,
      undefined,
      true,
    )
  }
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Pages',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description:
      'Every page of the site, built from sections. Portfolio pieces and journal articles use their own templates (below).',
    livePreview: { url: ({ data }) => generatePreviewPath(pagePath(data?.slug)) },
    preview: (data) => generatePreviewPath(pagePath(data?.slug as string | undefined)),
  },
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: {
    drafts: { autosave: { interval: 375 }, schedulePublish: true },
    maxPerDoc: 50,
  },
  hooks: {
    beforeDelete: [protectSystemPages],
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The page’s name in the CMS and in Google, unless the SEO tab sets one.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              label: 'Sections',
              type: 'blocks',
              blocks: [],
              blockReferences: pageBlockSlugs,
              validate: validateLayout,
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                initCollapsed: true,
                description:
                  'The page from top to bottom. Add sections with the button below, drag to reorder, and use ⋯ to duplicate or remove one.',
              },
            },
          ],
        },
        {
          label: 'Options',
          fields: [
            {
              name: 'numberSections',
              label: 'Number the sections ("01 / …")',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Adds a number to each section’s small label, in page order.',
              },
            },
            linkGroup({
              name: 'mobileCta',
              label: 'Phone button',
              required: false,
              description:
                'Optional. An orange bar pinned to the bottom of the screen on phones, e.g. "Your next tattoo" to #tattoo-enquiry.',
            }),
          ],
        },
        seoTab(),
      ],
    },
    slugField({
      useAsSlug: 'title',
      position: 'sidebar',
      overrides: (row) => {
        for (const field of row.fields) {
          if ('name' in field && field.name === 'slug') {
            const slug = field as TextField
            slug.validate = validateSlug
            // Home, Portfolio and Journal keep their address, even when their title changes.
            slug.access = { update: ({ doc }) => !isSystemPage(doc?.slug) }
            slug.admin = {
              ...slug.admin,
              description:
                'The page’s address: "aftercare" makes /aftercare. The homepage is "home". Home, Portfolio and Journal keep theirs.',
            }
          }
        }
        return row
      },
    }),
  ],
}
