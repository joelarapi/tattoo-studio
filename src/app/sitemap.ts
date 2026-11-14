import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { pathForDoc } from '@/lib/routes'
import { getCanonicalOrigin } from '@/lib/site-url'

// Refresh published URLs without requiring a new deployment after CMS edits.
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const origin = getCanonicalOrigin()
  const groups = await Promise.all(
    (['pages', 'posts', 'portfolio-items'] as const).map(async (collection) => {
      const { docs } = await payload.find({
        collection,
        depth: 0,
        pagination: false,
        draft: false,
        overrideAccess: false,
        where: collection === 'portfolio-items' ? undefined : { _status: { equals: 'published' } },
        select: { slug: true, updatedAt: true },
      })
      return docs
        .filter((doc) => doc.slug)
        .map((doc) => ({
          url: new URL(pathForDoc(collection, doc.slug), origin).href,
          lastModified: doc.updatedAt,
        }))
    }),
  )
  const guides = ['/visit/from-italy', '/visit/from-germany', '/services/geometric-tattoo']
  return [...groups.flat(), ...guides.map((path) => ({ url: new URL(path, origin).href }))]
}
