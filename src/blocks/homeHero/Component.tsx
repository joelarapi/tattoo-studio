import Link from 'next/link'

import { HeroStencil } from '@/components/art/Stencils'
import { HeroParallax } from '@/components/motion/HeroParallax'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Lines, Paragraphs } from '@/components/ui/Text'

import type { BlockProps } from '../types'

const HERO_ID = 'hero'

/**
 * The homepage's page top: title, intro and buttons on the left; two tilted, framed photos and
 * line art on the right.
 */
export function HomeHero({ block: hero }: BlockProps<'homeHero'>) {
  const imagesLink = hero.imagesLink || '/portfolio'
  return (
    <section
      id={HERO_ID}
      data-block="homeHero"
      className="grid-bg grid grid-cols-1 overflow-hidden px-[6%] pt-10 pb-[30px] [--circle-size:400px] md:min-h-[660px] md:grid-cols-[1.08fr_1fr] md:items-center md:gap-[3%] md:px-[5%] md:pt-[45px] md:pb-[50px] lg:min-h-[700px] lg:gap-[4%] lg:px-site lg:pt-[65px] lg:[--circle-size:720px] lg:[--circle-x:70%] lg:[--circle-y:46%]"
    >
      <HeroParallax target={HERO_ID} />
      <div className="@container">
        <span className="mb-[23px] flex items-center gap-2.5 font-label text-[14px] tracking-[1px] text-text uppercase md:mb-[26px] md:text-[14px] md:tracking-[1.3px]">
          <i className="size-[7px] rounded-full bg-accent shadow-[0_0_20px] shadow-accent/50" />
          {hero.label}
        </span>
        <StyledHeading as="h1" value={hero.heading} className="text-hero" />
        <Paragraphs
          text={hero.intro}
          className="mt-[22px] max-w-[520px] text-[16px] leading-[1.8] md:mt-[26px] md:text-[16px] md:leading-[1.65]"
        />
        <Paragraphs
          text={hero.supporting}
          className="mt-4 max-w-[520px] text-[16px] leading-[1.85] text-[#999] md:text-[16px]"
        />
        <div className="mt-[25px] flex flex-wrap items-center gap-[22px] md:mt-[30px] lg:gap-[25px]">
          <Action
            link={hero.primaryCta}
            className="max-md:px-[17px] max-md:py-[15px] max-md:text-[14px]"
          />
          <Action link={hero.secondaryLink} variant="plain" arrow="down" />
        </div>
        {(hero.factValue || hero.secondFact) && (
          <div className="mt-[30px] flex items-center gap-[25px] font-label text-[14px] leading-[1.6] text-[#999] uppercase md:mt-8 md:gap-5 md:text-[14px] lg:mt-[45px] lg:gap-[30px]">
            {hero.factValue && (
              <span className="flex max-w-[150px] items-center gap-3 md:max-w-[190px]">
                <b className="font-sans text-[39px] leading-none font-normal tracking-[-2px] text-[#eee] md:text-[45px]">
                  {hero.factValue}
                </b>
                {hero.factLabel}
              </span>
            )}
            {hero.secondFact && (
              <span className="border-l border-[#444] pl-[15px] lg:pl-[25px]">
                <Lines text={hero.secondFact} />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative isolate mt-[45px] mr-2 h-[410px] md:mt-2.5 md:mr-0 md:h-[490px] lg:h-[580px]">
        <HeroStencil className="absolute -top-[45px] -right-[35px] z-0 h-[225px] w-[180px] rotate-[14deg] opacity-55 md:-top-10 md:-right-[45px] md:h-[288px] md:w-[230px] lg:-top-[85px] lg:-right-[65px] lg:h-[338px] lg:w-[270px] lg:opacity-50" />
        <Link
          href={imagesLink}
          className="absolute inset-[0_35px_55px_5px] z-[1] block [transform:translate3d(0,var(--primary-shift,0px),0)_rotate(-4deg)] border border-[#454545] bg-panel p-[9px] shadow-[0_30px_60px_#0008] before:absolute before:-inset-[7px] before:size-[25px] before:border-t-2 before:border-l-2 before:border-accent before:content-[''] md:inset-[0_30px_55px_0] lg:inset-[0_50px_75px_0]"
        >
          <span className="relative block size-full">
            <CmsImage
              media={hero.primaryImage}
              photo={false}
              fill
              sizes="(min-width: 681px) 45vw, 90vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-[50%_36%]"
            />
          </span>
          {hero.primaryCaption && (
            <span className="absolute bottom-[22px] left-5 bg-[#000a] p-2 label-xs text-[#eee]">
              {hero.primaryCaption} ↗&#xFE0E;
            </span>
          )}
        </Link>
        <Link
          href={imagesLink}
          className="absolute -right-1.5 bottom-[15px] z-[1] h-[210px] w-[48%] [transform:translate3d(0,var(--secondary-shift,0px),0)_rotate(5deg)] border border-[#555] bg-[#181818] p-2 shadow-[-10px_10px_40px_#000a] md:right-0 md:h-[240px] md:w-[52%] lg:-right-[15px] lg:h-[285px]"
        >
          <span className="relative block size-full">
            <CmsImage
              media={hero.secondaryImage}
              photo={false}
              fill
              sizes="(min-width: 681px) 25vw, 45vw"
              className="object-cover"
            />
          </span>
          {hero.secondaryCaption && (
            <span className="absolute right-3 bottom-[17px] left-3.5 bg-[#0009] p-[7px] font-label text-[14px] leading-[1.5] uppercase">
              {hero.secondaryCaption}
            </span>
          )}
        </Link>
        {hero.artNote && (
          <span className="absolute -bottom-[5px] left-2.5 label-xs tracking-[2px] text-[#888] md:bottom-0">
            {hero.artNote}
          </span>
        )}
      </div>
    </section>
  )
}
