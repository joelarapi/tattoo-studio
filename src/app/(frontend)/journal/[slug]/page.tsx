import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Action } from '@/components/ui/Action'
import { EndCta, Notice } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { Tag } from '@/components/ui/Tag'
import { getJournalPage, getPost, getPosts, getSiteSettings } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { pageMetadata } from '@/lib/metadata'
import { categoryTitle } from '@/lib/posts'
import { getServerURL } from '@/lib/preview'
import { PAGE_GLOBALS, pathForDoc } from '@/lib/routes'
import { headingNodeId, tableOfContents } from '@/lib/toc'
import type { Artist, CallToActionBlock, Media } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()])
  if (!post) return {}
  return pageMetadata({
    settings,
    meta: post.meta,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt,
    image: post.cover,
    path: pathForDoc('posts', slug),
    type: 'article',
  })
}

// Headings get ids for the "In this guide" links; the CTA block becomes a boxed note.
const converters: JSXConverters = {
  heading: ({ node, nodesToJSX }) => {
    const Heading = node.tag
    return (
      <Heading id={node.tag === 'h2' ? headingNodeId(node) : undefined}>
        {nodesToJSX({ nodes: node.children })}
      </Heading>
    )
  },
  blocks: {
    cta: ({ node }) => {
      const fields = node.fields as unknown as CallToActionBlock
      return (
        <Notice className="my-10">
          <b className="block text-[15px] font-normal text-text">{fields.heading}</b>
          {fields.text && <span className="mt-1 block">{fields.text}</span>}
          <Action link={fields.button} variant="plain" className="mt-3" />
        </Notice>
      )
    },
  },
}

const articleBody = [
  'text-[14px] leading-[1.9] md:text-[15px]',
  '[&_h2]:mt-10 [&_h2]:scroll-mt-5 [&_h2]:text-[31px] [&_h2]:leading-[1.13] [&_h2]:tracking-[-1px] md:[&_h2]:text-[32px]',
  '[&_h3]:mt-8 [&_h3]:text-h3 [&_h4]:mt-6 [&_h4]:text-[18px]',
  '[&_p]:mt-[23px] [&_ul]:mt-[23px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-[23px] [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mt-[23px] [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-text',
  '[&_img]:mt-[23px] [&_img]:h-auto [&_img]:w-full [&_img]:rounded-[5px]',
].join(' ')

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, page, settings] = await Promise.all([
    getPost(slug),
    getJournalPage(),
    getSiteSettings(),
  ])
  if (!post) notFound()

  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const author = typeof post.author === 'object' ? (post.author as Artist | null) : null
  const contents = tableOfContents(post.content)
  const category = categoryTitle(post)
  const date = formatDate(post.publishedAt)
  const url = `${getServerURL()}${pathForDoc('posts', slug)}`

  return (
    <main id="main">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: cover?.url ?? undefined,
          url,
          author: author
            ? { '@type': 'Person', name: author.name }
            : { '@type': 'Organization', name: settings.studioName },
          publisher: { '@type': 'Organization', name: settings.studioName },
        }}
      />

      <section className="grid-bg overflow-hidden px-[6%] pt-[45px] pb-[60px] md:px-[12%] md:pt-[65px] md:pb-20">
        <Link
          href={PAGE_GLOBALS['journal-page']}
          className="mb-[45px] block label text-[#999] hover:text-text"
        >
          ← {page.article.backLabel}
        </Link>
        <Tag>{[category, date].filter(Boolean).join(' / ')}</Tag>
        <h1 className="max-w-[1000px] text-[49px] leading-[1.06] tracking-[-2px] md:text-[clamp(46px,6vw,86px)] md:tracking-[-3px]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-[23px] max-w-[700px] text-[15px] md:text-[18px]">{post.excerpt}</p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-[30px] px-site py-section md:grid-cols-[1fr_3fr] md:gap-[8%]">
        <aside className="border-b border-line-strong pb-[25px] md:border-0 md:pb-0">
          {contents.length > 0 && (
            <nav aria-label={page.article.tocLabel ?? 'Contents'} className="md:sticky md:top-8">
              {page.article.tocLabel && <span className="tag">{page.article.tocLabel}</span>}
              <ol className="flex flex-col gap-2.5 text-[11px]">
                {contents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="hover:text-text">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {author && <p className="mt-6 text-[11px]">{author.name}</p>}
        </aside>

        <article>
          {cover && (
            <CmsImage
              media={cover}
              sizes="(min-width: 681px) 65vw, 100vw"
              loading="eager"
              fetchPriority="high"
              className="max-h-[480px] w-full rounded-[5px] object-cover"
            />
          )}
          <RichText data={post.content} converters={converters} className={articleBody} />
          <Action href={PAGE_GLOBALS['journal-page']} variant="outline" className="mt-10">
            {page.article.backButtonLabel}
          </Action>
        </article>
      </div>

      <EndCta cta={settings.endCta} />
    </main>
  )
}
