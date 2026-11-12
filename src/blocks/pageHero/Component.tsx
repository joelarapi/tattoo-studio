import { Action } from '@/components/ui/Action'
import { HeroPhoto } from '@/components/ui/Blocks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Lines, Paragraphs } from '@/components/ui/Text'
import { cn } from '@/lib/cn'
import type { PageHeroBlock } from '@/payload-types'

import type { BlockContext, BlockProps } from '../types'

/** The bar of links under the page top to the sections that have a jump-link label. */
function JumpBar({ links }: { links: BlockContext['jumpLinks'] }) {
  if (!links.length) return null
  return (
    <nav
      aria-label="On this page"
      className="flex flex-wrap justify-between gap-x-5 gap-y-3 border-y border-line bg-[#101010] px-site py-[23px]"
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="font-label text-[14px] text-text uppercase hover:text-accent md:text-[14px]"
        >
          {link.label} ↓&#xFE0E;
        </a>
      ))}
    </nav>
  )
}

/** Inner pages: centred label, title, intro and a small index line on the grid. */
function Centred({ hero }: { hero: PageHeroBlock }) {
  return (
    <section
      data-block="pageHero"
      className={cn(
        'grid-bg flex min-h-[530px] flex-col items-center justify-center overflow-hidden px-[6%] pt-[65px] pb-[45px] text-center md:pt-[85px] md:pb-[65px]',
        hero.height === 'compact' ? 'md:min-h-[500px]' : 'md:min-h-[570px]',
      )}
    >
      <HeroPhoto media={hero.background} />
      {hero.tag && (
        <span className="mb-6 rounded-[5px] border border-line bg-panel-2 px-3 py-2 label-xs text-accent md:px-4 md:py-2.5 md:text-[14px]">
          {hero.tag}
        </span>
      )}
      <StyledHeading as="h1" value={hero.heading} className="text-display" />
      {hero.intro && (
        <p className="mt-[23px] text-[16px] md:text-[17px]">
          <Lines text={hero.intro} />
        </p>
      )}
      <Action link={hero.button} className="mt-[30px]" />
      <Paragraphs
        text={hero.note}
        className="mt-[23px] max-w-[540px] text-[16px] leading-[1.85] text-[#969696]"
      />
      {hero.jumpLink?.href && hero.jumpLink.label && (
        <a href={hero.jumpLink.href} className="mt-[35px] block label">
          {hero.jumpLink.label} ↓&#xFE0E;
        </a>
      )}
      {hero.indexLabel && (
        <span className="mt-[35px] label-xs tracking-[2px] text-faint md:mt-[45px]">
          {hero.indexLabel}
        </span>
      )}
    </section>
  )
}

/** Text on the left and the trip outline on the right (Visiting Albania). */
function Split({ hero }: { hero: PageHeroBlock }) {
  const stops = hero.sidePanel?.stops ?? []
  return (
    <section
      data-block="pageHero"
      className="grid-bg grid grid-cols-1 items-center gap-10 overflow-hidden px-[6%] py-[60px] md:grid-cols-[1.2fr_1fr] md:gap-[5%] md:px-[5%] lg:gap-[9%] lg:px-site lg:py-20"
    >
      <HeroPhoto media={hero.background} />
      <div>
        <Tag>{hero.tag}</Tag>
        <StyledHeading
          as="h1"
          value={hero.heading}
          className="text-[49px] leading-[1.06] tracking-[-2.5px] md:text-[clamp(48px,5.5vw,84px)] md:tracking-[-3.5px]"
        />
        <Paragraphs text={hero.intro} className="mt-[23px] max-w-[540px] text-[16px]" />
        <Action link={hero.button} className="mt-[30px]" />
        <Paragraphs
          text={hero.note}
          className="mt-[23px] max-w-[540px] text-[16px] leading-[1.85] text-[#969696]"
        />
        {hero.jumpLink?.href && hero.jumpLink.label && (
          <a href={hero.jumpLink.href} className="mt-[35px] block label">
            {hero.jumpLink.label} ↓&#xFE0E;
          </a>
        )}
      </div>
      {stops.length > 0 && (
        <div
          data-reveal
          className="relative rounded-md border border-[#343434] bg-[#111b] p-[25px] lg:px-[35px] lg:py-[30px]"
        >
          {hero.sidePanel?.title && (
            <span className="block label-xs text-[#888]">{hero.sidePanel.title}</span>
          )}
          <ol>
            {stops.map((stop, index) => (
              <li key={stop.id} className="relative flex gap-5 pt-[38px] lg:gap-[25px]">
                {index < stops.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[57px] left-2 h-full border-l border-dashed border-accent/45"
                  />
                )}
                <i className="relative z-[1] mt-1.5 size-[17px] shrink-0 rounded-full border border-accent bg-panel shadow-[0_0_0_6px] shadow-accent/10" />
                <div>
                  <span className="font-label text-[14px] tracking-[1px] text-accent uppercase">
                    {String(index + 1).padStart(2, '0')}
                    {stop.label && ` / ${stop.label}`}
                  </span>
                  <b className="mt-2 block text-[30px] leading-[1.2] font-normal tracking-[-1.5px] text-text lg:text-[36px]">
                    {stop.title}
                  </b>
                  {stop.text && <p className="mt-2.5 text-[16px]">{stop.text}</p>}
                </div>
              </li>
            ))}
          </ol>
          {hero.sidePanel?.footnote && (
            <span className="mt-[35px] block label-xs text-[#888]">{hero.sidePanel.footnote}</span>
          )}
        </div>
      )}
    </section>
  )
}

/** The top of an inner page, with an optional jump bar under it. Always the page's H1. */
export function PageHero({ block, ctx }: BlockProps<'pageHero'>) {
  return (
    <>
      {block.layout === 'split' ? <Split hero={block} /> : <Centred hero={block} />}
      {block.showJumpBar && <JumpBar links={ctx.jumpLinks} />}
    </>
  )
}
