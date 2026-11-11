import { Action } from '@/components/ui/Action'
import { EndCta } from '@/components/ui/Blocks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Paragraphs } from '@/components/ui/Text'
import { getSiteSettings } from '@/lib/data'
import type { SiteSetting } from '@/payload-types'

import type { BlockOf, BlockProps } from '../types'

type Data = { shared: SiteSetting['endCta'] | null }

/** The shared call to action from Studio details, when the block uses it. */
export async function loadPageCta(block: BlockOf<'pageCta'>): Promise<Data | null> {
  if (block.source !== 'own') {
    const shared = (await getSiteSettings()).endCta
    return shared?.heading?.text ? { shared } : null
  }
  return block.heading?.text ? { shared: null } : null
}

/** A closing call to action: centred on the grid, or a band with up to two buttons. */
export function PageCta({ block, data, ctx }: BlockProps<'pageCta', Data>) {
  if (data.shared) {
    return <EndCta cta={data.shared} as={ctx.headingAs} />
  }
  if (block.style === 'band') {
    return (
      <section
        data-block="pageCta"
        className="border-y border-line bg-[#101010] px-site py-section"
      >
        <div data-reveal>
          <Tag>{block.tag}</Tag>
          <StyledHeading
            as={ctx.headingAs}
            value={block.heading}
            className="text-[37px] leading-[1.13] tracking-[-1.5px] md:text-[45px] md:tracking-[-2px]"
          />
        </div>
        <Paragraphs
          text={block.text}
          className="mt-[23px] max-w-[700px] text-[16px] leading-[1.9]"
        />
        {!!block.links?.length && (
          <div className="mt-7 flex flex-wrap gap-[15px]">
            {block.links.map((link) => (
              <Action key={link.id} link={link} variant="outline" />
            ))}
          </div>
        )}
      </section>
    )
  }
  return (
    <EndCta
      cta={{
        tag: block.tag,
        heading: block.heading,
        text: block.text,
        button: block.button,
        note: block.note,
      }}
      as={ctx.headingAs}
    />
  )
}
