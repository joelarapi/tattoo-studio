import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { templateBlockSlugs } from '@/blocks'
import { validateSections } from '@/blocks/validate'
import { text } from '@/fields/content'
import { revalidateGlobal } from '@/hooks/revalidate'

/*
 * The labels shared by every journal article's own page (/journal/<slug>), and the sections that
 * follow the article. The articles themselves are in Content → Journal posts.
 */
export const ArticleTemplate: GlobalConfig = {
  slug: 'article-template',
  label: 'Journal article pages',
  admin: {
    group: 'Pages',
    description:
      'Shared by every journal article’s own page. The articles themselves are in Content → Journal posts.',
  },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal({ global: 'article-template' })] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Text',
          fields: [
            text('tocLabel', 'Above the list of sections, e.g. "In this guide".'),
            text('backLabel', 'Small link at the top, e.g. "All articles".', true),
            text('backButtonLabel', 'Button at the end, e.g. "Back to the journal".'),
          ],
        },
        {
          label: 'Sections after the article',
          fields: [
            {
              name: 'after',
              label: 'Sections',
              type: 'blocks',
              blocks: [],
              blockReferences: templateBlockSlugs,
              validate: validateSections,
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                initCollapsed: true,
                description: 'Shown under every article, top to bottom.',
              },
            },
          ],
        },
      ],
    },
  ],
}
