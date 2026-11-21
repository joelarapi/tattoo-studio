import { getCanonicalOrigin } from '@/lib/site-url'

import { JsonLd } from './JsonLd'

type Breadcrumb = {
  name: string
  path: string
}

/** Canonical BreadcrumbList data for a page and its parent pages. */
export function BreadcrumbStructuredData({ items }: { items: Breadcrumb[] }) {
  const origin = getCanonicalOrigin()

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(({ name, path }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: new URL(path, origin).href,
        })),
      }}
    />
  )
}
