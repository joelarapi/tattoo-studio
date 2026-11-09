import type { Post } from '@/payload-types'

/** The first category's title, shown as the article's label. */
export function categoryTitle(post: Pick<Post, 'categories'>): string | null {
  const category = post.categories?.find((c) => typeof c === 'object')
  return typeof category === 'object' ? (category?.title ?? null) : null
}
