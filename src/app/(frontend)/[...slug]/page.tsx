import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { getLegalPage, getLegalPageSlugs, getSiteSettings } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { pageMetadata } from '@/lib/metadata'
import { pathForDoc } from '@/lib/routes'

/*
 * Legal pages (/privacy, /cookies) from Settings → Legal pages. As a catch-all it also receives
 * every URL no other page matches, and answers those with the site's 404 page (not-found.tsx).
 */

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return (await getLegalPageSlugs()).map((slug) => ({ slug: [slug] }))
}

/** The legal page for this URL, or null. Unknown URLs never reach the database. */
async function findPage(segments: string[]) {
  if (segments.length !== 1) return null
  const slugs = await getLegalPageSlugs()
  return slugs.includes(segments[0]) ? getLegalPage(segments[0]) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [page, settings] = await Promise.all([findPage(slug), getSiteSettings()])
  if (!page) return {}
  return pageMetadata({
    settings,
    fallbackTitle: page.title,
    path: pathForDoc('legal-pages', page.slug),
  })
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params
  const page = await findPage(slug)
  if (!page) notFound()

  return (
    <main id="main" className="pb-section px-site pt-[45px] md:pt-[65px]">
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-[49px] leading-[1.06] tracking-[-2px] md:text-[clamp(46px,6vw,80px)] md:tracking-[-3px]">
          {page.title}
        </h1>
        <p className="mt-6 label text-faint">Last updated {formatDate(page.updatedAt)}</p>
        <RichText
          data={page.content}
          className="mt-10 text-[14px] leading-[1.9] md:text-[15px] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_ol]:mt-[23px] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-[23px] [&_ul]:mt-[23px] [&_ul]:list-disc [&_ul]:pl-5"
        />
      </div>
    </main>
  )
}
