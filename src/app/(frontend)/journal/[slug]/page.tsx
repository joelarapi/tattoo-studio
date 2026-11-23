import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RichText } from '@/components/RichText'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import { JsonLd } from '@/components/seo/JsonLd'
import { Action } from '@/components/ui/Action'
import { Notice } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
import { getArticleTemplate, getPost, getPosts, getSiteSettings } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { pageMetadata } from '@/lib/metadata'
import { categoryTitle } from '@/lib/posts'
import { getServerURL } from '@/lib/preview'
import { pathForDoc } from '@/lib/routes'
import { headingNodeId, tableOfContents } from '@/lib/toc'
import type { Artist, CallToActionBlock, Media } from '@/payload-types'

import styles from './article.module.css'

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

// Preserve CMS copy and rich-text marks; add layout only where the content has structure.
const textOfNode = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''
  const node = value as { text?: string; children?: unknown[] }
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(textOfNode).join('')
}

const converters: JSXConverters = {
  heading: ({ node, nodesToJSX }) => {
    const Heading = node.tag
    const first = node.children[0]

    // Style an existing leading section number without changing its words or anchor.
    if (node.tag === 'h2' && first && 'text' in first && typeof first.text === 'string') {
      const number = first.text.match(/^(\d{1,2}[.)])\s+/)
      if (number) {
        const remaining = [
          { ...first, text: first.text.slice(number[0].length) },
          ...node.children.slice(1),
        ]
        return (
          <Heading id={headingNodeId(node)}>
            <span className={styles.sectionNumber}>{number[1]}</span>{' '}
            {nodesToJSX({ nodes: remaining })}
          </Heading>
        )
      }
    }

    return (
      <Heading id={node.tag === 'h2' ? headingNodeId(node) : undefined}>
        {nodesToJSX({ nodes: node.children })}
      </Heading>
    )
  },
  paragraph: ({ node, nodesToJSX }) => {
    const words = textOfNode(node).trim()
    // Only short notes that already start "Best for" become compact category pills.
    const isQuickTip = /^best for\b/i.test(words) && words.length <= 115
    return (
      <p className={isQuickTip ? styles.quickTip : undefined}>
        {nodesToJSX({ nodes: node.children })}
      </p>
    )
  },
  blocks: {
    cta: ({ node }) => {
      const fields = node.fields as unknown as CallToActionBlock
      return (
        <Notice className={styles.inlineNotice}>
          <b className="block text-[15px] font-normal text-text">{fields.heading}</b>
          {fields.text && <span className="mt-1 block">{fields.text}</span>}
          <Action link={fields.button} variant="plain" className="mt-3" />
        </Notice>
      )
    },
  },
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, labels, settings] = await Promise.all([
    getPost(slug),
    getArticleTemplate(),
    getSiteSettings(),
  ])
  if (!post) notFound()

  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const author = typeof post.author === 'object' ? (post.author as Artist | null) : null
  const contents = tableOfContents(post.content)
  const category = categoryTitle(post)
  const date = formatDate(post.publishedAt)
  const url = `${getServerURL()}${pathForDoc('posts', slug)}`
  const journalPath = pathForDoc('pages', 'journal')

  return (
    <main id="main" className={styles.page}>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: journalPath },
          { name: post.title, path: pathForDoc('posts', slug) },
        ]}
      />
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

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href={journalPath} className={styles.backLink}>
            ← {labels.backLabel}
          </Link>
          <span className={styles.meta}>{[category, date].filter(Boolean).join(' / ')}</span>
          <h1 className={styles.headline}>{post.title}</h1>
          {post.excerpt && <p className={styles.intro}>{post.excerpt}</p>}
        </div>
      </section>

      <div className={styles.mainLayout}>
        <article className={styles.article}>
          {cover && (
            <CmsImage
              media={cover}
              sizes="(min-width: 1001px) 65vw, 100vw"
              loading="eager"
              fetchPriority="high"
              className={styles.cover}
            />
          )}
          <RichText data={post.content} converters={converters} className={styles.content} />
          <Action href={journalPath} variant="accent" className={styles.backButton}>
            {labels.backButtonLabel}
          </Action>
        </article>

        <aside className={styles.sidebar}>
          {contents.length > 0 && (
            <nav aria-label={labels.tocLabel ?? 'Contents'} className={styles.outline}>
              <h2 className={styles.outlineTitle}>{labels.tocLabel ?? 'In this guide'}</h2>
              <ol className={styles.outlineList}>
                {contents.map((item, index) => (
                  <li key={item.id} className={styles.outlineItem}>
                    <span aria-hidden="true" className={styles.outlineNumber}>
                      {index + 1}
                    </span>
                    <a href={`#${item.id}`} className={styles.outlineLink}>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className={styles.ctaCard}>
            <h2 className={styles.ctaHeading}>Planning a tattoo in Albania?</h2>
            <p className={styles.ctaText}>
              Explore how to plan your studio visit before you travel.
            </p>
            <Link href="/visiting-albania" className={styles.goldButton}>
              Plan your visit
              <span aria-hidden="true" className={styles.buttonIcon}>↗</span>
            </Link>
          </div>

          {author && <p className={styles.author}>{author.name}</p>}
        </aside>
      </div>

      <RenderBlocks blocks={labels.after} titleFromFirst={false} />
    </main>
  )
}
