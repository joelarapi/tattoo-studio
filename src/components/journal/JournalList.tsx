'use client'

import Link from 'next/link'
import { type ReactNode, useId, useState } from 'react'

export type ArticleCard = {
  id: number
  href: string
  title: string
  excerpt?: string | null
  category?: string | null
  /** The cover image, rendered on the server. */
  cover: ReactNode
}

/**
 * The journal's article grid with a topic search. Without JS every article is listed and the
 * search box does nothing.
 */
export function JournalList({
  heading,
  articles,
  searchLabel,
  searchPlaceholder,
  emptyText,
  readLabel,
}: {
  heading: string
  articles: ArticleCard[]
  searchLabel?: string | null
  searchPlaceholder?: string | null
  emptyText: string
  readLabel: string
}) {
  const [query, setQuery] = useState('')
  const searchID = useId()
  const words = query.trim().toLowerCase()
  const shown = words
    ? articles.filter((article) =>
        [article.title, article.excerpt, article.category].join(' ').toLowerCase().includes(words),
      )
    : articles

  return (
    <>
      <div className="mt-[55px] mb-[35px] md:mt-[85px] md:flex md:items-end md:justify-between md:gap-[30px]">
        <h2 className="text-[35px] leading-[1.13] tracking-[-1.5px] md:text-[40px]">{heading}</h2>
        <label htmlFor={searchID} className="mt-[25px] block label-sm text-[#999] md:mt-0">
          {searchLabel}
          <input
            id={searchID}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder ?? undefined}
            className="mt-2.5 block w-full rounded-sm border border-line-strong bg-[#131313] px-[15px] py-3 font-sans text-[12px] tracking-normal text-white normal-case md:w-[260px]"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-[25px]">
        {shown.map((article) => (
          <article key={article.id}>
            <Link href={article.href} className="group block">
              <div className="relative h-[310px] overflow-hidden rounded-[5px] bg-panel-2 md:h-[200px] lg:h-[250px]">
                {article.cover}
                <span
                  aria-hidden="true"
                  className="absolute right-[15px] bottom-3 text-[23px] text-text"
                >
                  ↗&#xFE0E;
                </span>
              </div>
              {article.category && (
                <span className="mt-[22px] tag mb-3.5 label-sm">{article.category}</span>
              )}
              <h3 className="text-[29px] leading-[1.25] tracking-[-0.7px] md:text-[22px] lg:text-[26px]">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mt-[15px] text-[14px] md:text-[12px]">{article.excerpt}</p>
              )}
              <span className="mt-6 inline-block border-b border-[#555] pb-[7px] label-sm text-text">
                {readLabel} ↗&#xFE0E;
              </span>
            </Link>
          </article>
        ))}
      </div>
      <p role="status" className="mt-6 text-[13px] empty:hidden">
        {shown.length === 0 ? emptyText : ''}
      </p>
    </>
  )
}
