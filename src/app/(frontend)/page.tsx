import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageView, pageViewMetadata } from '@/blocks/PageView'
import { getPage } from '@/lib/data'
import { HOME_SLUG } from '@/lib/routes'

/** The homepage: the page "home" in Pages, built from its sections. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(HOME_SLUG)
  return page ? pageViewMetadata(page) : {}
}

export default async function HomePage() {
  const page = await getPage(HOME_SLUG)
  if (!page) notFound()
  return <PageView page={page} />
}
