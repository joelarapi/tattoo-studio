import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { PortfolioGrid as Grid } from '@/components/portfolio/PortfolioGrid'
import { RichText } from '@/components/RichText'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { getPortfolioItems, getStyles } from '@/lib/data'
import type { PortfolioItem, Style } from '@/payload-types'

import { BlockSection } from '../BlockSection'
import { populatedOne } from '../populated'
import type { BlockOf, BlockProps } from '../types'

type Data = { items: PortfolioItem[]; styles: Style[] }

/** Every piece, or only the chosen category's. */
export async function loadPortfolioGrid(block: BlockOf<'portfolioGrid'>): Promise<Data> {
  const [items, styles] = await Promise.all([getPortfolioItems(), getStyles()])
  const only =
    populatedOne(block.style)?.id ?? (typeof block.style === 'number' ? block.style : null)
  if (!only) return { items, styles }
  const styleID = (item: PortfolioItem) =>
    typeof item.style === 'object' ? item.style.id : item.style
  return { items: items.filter((item) => styleID(item) === only), styles: [] }
}

/** An introduction, then the portfolio with its category filter. */
export function PortfolioGrid({ block, data, ctx }: BlockProps<'portfolioGrid', Data>) {
  const { intro } = block
  const cards = data.items.map((item, index) => ({
    id: item.id,
    category: typeof item.style === 'object' ? item.style.slug : null,
    node: <PortfolioCard item={item} position={index + 1} />,
  }))
  const categories = data.styles.flatMap((style) =>
    style.slug ? [{ slug: style.slug, name: style.name }] : [],
  )
  return (
    <BlockSection block={block} className="px-site pt-10 pb-section">
      {(intro?.heading?.text || intro?.text) && (
        <div className="my-10 grid grid-cols-1 gap-[25px] md:my-[60px] md:grid-cols-[1fr_1.2fr] md:gap-[9%]">
          <div data-reveal>
            <Tag number={ctx.number}>{intro.tag}</Tag>
            <StyledHeading as={ctx.headingAs} value={intro.heading} className="text-h2-sm" />
          </div>
          <div data-reveal>
            <RichText
              data={intro.text}
              className="text-[16px] leading-[1.9] md:text-[16px] [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-[18px]"
            />
          </div>
        </div>
      )}
      <Grid
        cards={cards}
        categories={categories}
        allLabel={block.allLabel}
        countLabel={block.countLabel}
      />
    </BlockSection>
  )
}
