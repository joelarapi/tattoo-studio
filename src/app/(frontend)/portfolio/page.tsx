import type { Metadata } from 'next'

import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { RichText } from '@/components/RichText'
import { EndCta, PageHero } from '@/components/ui/Blocks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { getPortfolioItems, getPortfolioPage, getSiteSettings, getStyles } from '@/lib/data'
import { headingText } from '@/lib/heading'
import { pageMetadata } from '@/lib/metadata'
import { PAGE_GLOBALS } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPortfolioPage(), getSiteSettings()])
  return pageMetadata({
    settings,
    meta: page.meta,
    fallbackTitle: headingText(page.hero.heading),
    fallbackDescription: page.hero.intro,
    path: PAGE_GLOBALS['portfolio-page'],
  })
}

export default async function PortfolioPage() {
  const [page, settings, items, styles] = await Promise.all([
    getPortfolioPage(),
    getSiteSettings(),
    getPortfolioItems(),
    getStyles(),
  ])

  const cards = items.map((item, index) => ({
    id: item.id,
    category: typeof item.style === 'object' ? item.style.slug : null,
    node: <PortfolioCard item={item} position={index + 1} />,
  }))
  const categories = styles.flatMap((style) =>
    style.slug ? [{ slug: style.slug, name: style.name }] : [],
  )

  return (
    <main id="main">
      <PageHero hero={page.hero} short />

      <section className="pb-section px-site pt-10">
        <div className="my-10 grid grid-cols-1 gap-[25px] md:my-[60px] md:grid-cols-[1fr_1.2fr] md:gap-[9%]">
          <div data-reveal>
            <Tag>{page.intro.tag}</Tag>
            <StyledHeading value={page.intro.heading} className="text-h2-sm" />
          </div>
          <div data-reveal>
            <RichText
              data={page.intro.text}
              className="text-[13px] leading-[1.9] md:text-[14px] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-[18px]"
            />
          </div>
        </div>

        <PortfolioGrid
          cards={cards}
          categories={categories}
          allLabel={page.filter.allLabel}
          countLabel={page.filter.countLabel}
        />
      </section>

      <EndCta cta={settings.endCta} />
    </main>
  )
}
