import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDate } from '@/lib/format'
import type { Homepage, Post } from '@/payload-types'

type JournalProps = {
  copy: Homepage['journal']
  posts: Post[]
}

/** The latest posts: internal links that help Google find and rank the journal. */
export function Journal({ copy, posts }: JournalProps) {
  if (posts.length === 0) return null
  return (
    <section id="journal" aria-labelledby="journal-heading" className="py-section-lg">
      <Container>
        <SectionHeading
          id="journal-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          action={
            copy.button?.label &&
            copy.button.href && (
              <Button href={copy.button.href} variant="secondary" size="sm">
                {copy.button.label}
              </Button>
            )
          }
        />
        <ul className="mt-14 grid gap-gutter md:grid-cols-3">
          {posts.map((post) => {
            const category = post.categories?.find((c) => typeof c === 'object')
            return (
              <li key={post.id} data-reveal="" data-fade="">
                <article className="group relative flex h-full flex-col rounded-md bg-surface p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-bg">
                    <CmsImage
                      media={post.cover}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 ease-studio group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-3 pt-5 pb-3">
                    <p className="flex flex-wrap items-center gap-x-3 mono-label-sm text-text-muted">
                      {typeof category === 'object' && category && <span>{category.title}</span>}
                      <time dateTime={post.publishedAt ?? undefined}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </p>
                    <h3 className="text-h5">
                      <Link
                        href={`/journal/${post.slug}`}
                        className="after:absolute after:inset-0 after:rounded-md"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p>{post.excerpt}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
