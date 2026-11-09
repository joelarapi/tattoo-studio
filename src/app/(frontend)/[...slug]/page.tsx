import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageView, pageViewMetadata } from '@/blocks/PageView'
import { getPage, getPageSlugs } from '@/lib/data'
import { HOME_SLUG } from '@/lib/routes'

/*
 * Every page from Pages except the homepage (/about, /portfolio, /privacy, …). As a catch-all it
 * also receives every URL no other route matches, and answers those with the site's 404 page
 * (not-found.tsx).
 */

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.filter((slug) => slug !== HOME_SLUG).map((slug) => ({ slug: [slug] }))
}

/** The page for this URL, or null. Unknown URLs never reach the database. */
async function findPage(segments: string[]) {
  const [slug] = segments
  if (segments.length !== 1 || slug === HOME_SLUG) return null
  const slugs = await getPageSlugs()
  return slugs.includes(slug) ? getPage(slug) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await findPage((await params).slug)
  return page ? pageViewMetadata(page) : {}
}

export default async function BuiltPage({ params }: Props) {
  const page = await findPage((await params).slug)
  if (!page) notFound()
  return <PageView page={page} />
}
