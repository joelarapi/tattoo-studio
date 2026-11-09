import { slugField, type CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '@/access'
import { postEditor } from '@/fields/richText'
import { seoTab } from '@/fields/seo'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateCollection } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'
import { PAGE_GLOBALS, pathForDoc } from '@/lib/routes'

const postPath = (slug?: string | null) => pathForDoc('posts', slug)

const { afterChange, afterDelete } = revalidateCollection({
  collection: 'posts',
  paths: (doc) => (doc.slug ? [PAGE_GLOBALS['journal-page'], postPath(doc.slug)] : []),
})

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Journal post', plural: 'Journal posts' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    description:
      'The blog ("Journal"). Save as draft while writing; publish now, or schedule a date with the arrow next to Publish.',
    livePreview: { url: ({ data }) => generatePreviewPath(postPath(data?.slug)) },
    preview: (data) => generatePreviewPath(postPath(data?.slug as string | undefined)),
  },
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline. Aim for under 60 characters so Google shows all of it.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 160,
              admin: {
                description:
                  'One or two sentences shown in post lists, and used by Google if the SEO description is empty. Max 160 characters.',
              },
            },
            {
              name: 'cover',
              label: 'Cover image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              name: 'content',
              type: 'richText',
              editor: postEditor,
              required: true,
              admin: {
                description:
                  'Use headings (H2) to split the article; they become the table of contents. Add a "Call to action" or "Artist card" with the + button.',
              },
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField(),
    {
      name: 'publishedAt',
      label: 'Publish date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Filled in automatically on first publish. Shown on the article.',
      },
      hooks: { beforeChange: [populatePublishedAt] },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'artists',
      admin: {
        position: 'sidebar',
        description: 'Credit the post to an artist. Leave empty to credit the studio.',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Optional keywords, e.g. "first tattoo". Press Enter after each one.',
      },
    },
  ],
}
