import Link from 'next/link'

import { Action } from '@/components/ui/Action'
import { SectionHead } from '@/components/ui/Blocks'
import { getLatestPosts } from '@/lib/data'
import { categoryTitle } from '@/lib/posts'
import { pathForDoc } from '@/lib/routes'

import { BlockSection } from '../BlockSection'
import type { BlockOf, BlockProps } from '../types'

type Posts = Awaited<ReturnType<typeof getLatestPosts>>

export async function loadLatestPosts(block: BlockOf<'latestPosts'>): Promise<Posts | null> {
  const posts = await getLatestPosts(block.count || 3)
  return posts.length ? posts : null
}

/** The newest journal posts as cards. */
export function LatestPosts({ block, data: posts, ctx }: BlockProps<'latestPosts', Posts>) {
  return (
    <BlockSection block={block} className="px-site pt-[15px] pb-section md:pt-5">
      <SectionHead
        tag={block.tag}
        number={ctx.number}
        heading={block.heading}
        as={ctx.headingAs}
        action={<Action link={block.link} variant="plain" />}
      />
      <div data-reveal-group className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-[15px]">
        {posts.map((post) => {
          const category = categoryTitle(post)
          return (
            <Link
              key={post.id}
              href={pathForDoc('posts', post.slug)}
              data-reveal
              className="relative rounded-[5px] border border-[#222] bg-panel px-[25px] pt-[25px] pb-[55px] transition-colors hover:border-[#666] md:px-5 md:pt-[23px] md:pb-[60px] lg:px-7 lg:pt-[30px] lg:pb-[70px]"
            >
              {category && <span className="tag label-xs">{category}</span>}
              <h3 className="max-w-[90%] text-[27px] leading-[1.25] tracking-[-0.7px] md:text-[23px] lg:text-[26px]">
                {post.title}
              </h3>
              <span
                aria-hidden="true"
                className="absolute right-[25px] bottom-[22px] text-[24px] text-accent"
              >
                ↗&#xFE0E;
              </span>
            </Link>
          )
        })}
      </div>
    </BlockSection>
  )
}
