import type { GlobalConfig, Tab } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { generatePreviewPath } from '@/lib/preview'
import { PAGE_GLOBALS, type PageGlobalSlug } from '@/lib/routes'

type PageGlobalArgs = {
  slug: PageGlobalSlug
  label: string
  description: string
  tabs: Tab[]
}

/**
 * A page's copy, section by section. Drafts autosave and appear in live preview; Publish puts
 * them live. The SEO tab is appended by the SEO plugin (src/plugins/seo.ts), which needs the first
 * field to be the tabs field.
 */
export function pageGlobal({ slug, label, description, tabs }: PageGlobalArgs): GlobalConfig {
  const path = PAGE_GLOBALS[slug]
  return {
    slug,
    label,
    admin: {
      group: 'Pages',
      description,
      livePreview: { url: () => generatePreviewPath(path) },
      preview: () => generatePreviewPath(path),
    },
    access: {
      read: publishedOrLoggedIn,
      update: isAdminOrEditor,
    },
    versions: {
      drafts: { autosave: { interval: 375 } },
      max: 50,
    },
    hooks: { afterChange: [revalidateGlobal({ global: slug, paths: [path] })] },
    fields: [{ type: 'tabs', tabs }],
  }
}
