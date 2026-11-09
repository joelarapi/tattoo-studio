import type { Metadata } from 'next'
import Link from 'next/link'

import { JournalList } from '@/components/journal/JournalList'
import { EndCta, PageHero } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { Tag } from '@/components/ui/Tag'
import { getJournalPage, getPosts, getSiteSettings } from '@/lib/data'
import { headingText } from '@/lib/heading'
import { pageMetadata } from '@/lib/metadata'
import { categoryTitle } from '@/lib/posts'
import { PAGE_GLOBALS, pathForDoc } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getJournalPage(), getSiteSettings()])
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: headingText(page.hero.heading),
    fallbackDescription: page.hero.intro,
    path: PAGE_GLOBALS['journal-page'],
  })
}

export default async function JournalPage() {
  const [page, settings, posts] = await Promise.all([
    getJournalPage(),
    getSiteSettings(),
    getPosts(),
  ])
  const featuredID =
    typeof page.featured.post === 'object' ? page.featured.post?.id : page.featured.post
  const featured = posts.find((post) => post.id === featuredID) ?? posts[0]

  return (
    <main id="main">
      <PageHero hero={page.hero} className="md:min-h-[500px]" />

      <section className="pb-section px-site">
        {featured && (
          <>
            <Tag className="mb-10">{page.featured.tag}</Tag>
            <Link
              href={pathForDoc('posts', featured.slug)}
              data-reveal
              className="grid grid-cols-1 overflow-hidden rounded-[7px] border border-[#202020] bg-panel md:grid-cols-[1.15fr_1fr]"
            >
              <div className="relative h-[320px] md:h-[440px] lg:h-[490px]">
                <CmsImage
                  media={featured.cover}
                  fill
                  sizes="(min-width: 681px) 55vw, 100vw"
                  loading="eager"
                  className="object-cover"
                />
              </div>
              <div className="self-center p-[30px] lg:px-[45px] lg:py-[50px]">
                <Tag>
                  {[categoryTitle(featured), page.featured.label].filter(Boolean).join(' / ')}
                </Tag>
                <h2 className="text-[39px] leading-[1.13] tracking-[-1.5px] md:text-[36px] lg:text-[46px] lg:tracking-[-2px]">
                  {featured.title}
                </h2>
                {featured.excerpt && <p className="mt-[23px] text-[13px]">{featured.excerpt}</p>}
                <span className="mt-7 btn btn-outline">{page.featured.buttonLabel} ↗&#xFE0E;</span>
              </div>
            </Link>
          </>
        )}

        <JournalList
          heading={page.list.heading}
          searchLabel={page.list.searchLabel}
          searchPlaceholder={page.list.searchPlaceholder}
          emptyText={page.list.emptyText}
          readLabel={page.list.readLabel}
          articles={posts.map((post) => ({
            id: post.id,
            href: pathForDoc('posts', post.slug),
            title: post.title,
            excerpt: post.excerpt,
            category: categoryTitle(post),
            cover: (
              <CmsImage
                media={post.cover}
                fill
                sizes="(min-width: 681px) 33vw, 100vw"
                className="object-cover transition-transform duration-400 group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            ),
          }))}
        />
      </section>

      <EndCta cta={settings.endCta} />
    </main>
  )
}
