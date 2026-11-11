import Link from 'next/link'

import { JournalList as List } from '@/components/journal/JournalList'
import { CmsImage } from '@/components/ui/CmsImage'
import { Tag } from '@/components/ui/Tag'
import { getPosts } from '@/lib/data'
import { categoryTitle } from '@/lib/posts'
import { pathForDoc } from '@/lib/routes'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

type Posts = Awaited<ReturnType<typeof getPosts>>

export async function loadJournalList(): Promise<Posts> {
  return getPosts()
}

/** The featured article, then every article with a search box. */
export function JournalList({ block, data: posts, ctx }: BlockProps<'journalList', Posts>) {
  const { featured: copy, list } = block
  const featuredID = typeof copy.post === 'object' ? copy.post?.id : copy.post
  const featured = posts.find((post) => post.id === featuredID) ?? posts[0]
  const FeaturedHeading = ctx.headingAs

  return (
    <BlockSection block={block} className="px-site py-section">
      {featured && (
        <>
          <Tag className="mb-10" number={ctx.number}>
            {copy.tag}
          </Tag>
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
              <Tag>{[categoryTitle(featured), copy.label].filter(Boolean).join(' / ')}</Tag>
              <FeaturedHeading className="text-[39px] leading-[1.13] tracking-[-1.5px] md:text-[36px] lg:text-[46px] lg:tracking-[-2px]">
                {featured.title}
              </FeaturedHeading>
              {featured.excerpt && <p className="mt-[23px] text-[16px]">{featured.excerpt}</p>}
              <span className="mt-7 btn btn-outline">{copy.buttonLabel} ↗&#xFE0E;</span>
            </div>
          </Link>
        </>
      )}

      <List
        heading={list.heading}
        searchLabel={list.searchLabel}
        searchPlaceholder={list.searchPlaceholder}
        emptyText={list.emptyText}
        readLabel={list.readLabel}
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
    </BlockSection>
  )
}
