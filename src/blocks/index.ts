import type { Block, BlockSlug } from 'payload'

import { ArtistBlock } from './artist/config'
import { CardsBlock } from './cards/config'
import { DividerBlock } from './divider/config'
import { EnquiryBlock } from './enquiry/config'
import { FaqBlock } from './faq/config'
import { GalleryBlock } from './gallery/config'
import { HomeHeroBlock } from './homeHero/config'
import { ImageTextBlock } from './imageText/config'
import { JournalListBlock } from './journalList/config'
import { LatestPostsBlock } from './latestPosts/config'
import { PageCtaBlock } from './pageCta/config'
import { PageHeroBlock } from './pageHero/config'
import { PieceSuggestionsBlock } from './pieceSuggestions/config'
import { PortfolioGridBlock } from './portfolioGrid/config'
import { StepsBlock } from './steps/config'
import { TextBlock } from './text/config'
import { TextStripBlock } from './textStrip/config'
import { WorkShowcaseBlock } from './workShowcase/config'

/*
 * The page builder's sections. Each is defined once here and registered in `config.blocks`;
 * fields point at them with `blockReferences`. The React side is in ./registry.tsx.
 */

/**
 * What every block shares in the admin: a header naming the section by its heading (instead of
 * an editable block name) and a picture in the "Add section" drawer (scripts/block-thumbnails.ts).
 */
function forAdmin(block: Block): Block {
  const singular = block.labels?.singular
  return {
    ...block,
    imageURL: `/admin/blocks/${block.slug}.png`,
    imageAltText: `Preview of the ${typeof singular === 'string' ? singular : block.slug} section`,
    admin: {
      ...block.admin,
      disableBlockName: true,
      components: {
        ...block.admin?.components,
        Label: {
          path: '/components/admin/BlockLabel#BlockLabel',
          clientProps: { blockLabel: typeof singular === 'string' ? singular : block.slug },
        },
      },
    },
  }
}

/** Every block, in the order the admin's "Add section" drawer lists them (within each group). */
export const blocks: Block[] = [
  HomeHeroBlock,
  PageHeroBlock,
  TextStripBlock,
  TextBlock,
  ImageTextBlock,
  CardsBlock,
  StepsBlock,
  FaqBlock,
  LatestPostsBlock,
  JournalListBlock,
  WorkShowcaseBlock,
  PortfolioGridBlock,
  GalleryBlock,
  ArtistBlock,
  PieceSuggestionsBlock,
  EnquiryBlock,
  PageCtaBlock,
  DividerBlock,
].map(forAdmin)

const slugs = (list: Block[]) => list.map((block) => block.slug as BlockSlug)

/** Blocks that only work as a page's first section. */
export const heroBlockSlugs = ['homeHero', 'pageHero']

/** Everything a page can use. */
export const pageBlockSlugs = slugs(blocks)

/** What can follow a portfolio piece or journal article (their templates). */
export const templateBlockSlugs = slugs([
  PageCtaBlock,
  PieceSuggestionsBlock,
  LatestPostsBlock,
  TextBlock,
  ImageTextBlock,
  CardsBlock,
  GalleryBlock,
  DividerBlock,
])
