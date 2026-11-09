import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { linkList } from '@/fields/content'
import { linkGroup } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

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
            linkList('links', 'Shown left to right. Keep labels short.', 7),
            linkGroup({ name: 'cta', label: 'Menu button', description: 'The orange button.' }),
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: [
            linkList('links', 'The footer’s list of pages.', 8),
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
