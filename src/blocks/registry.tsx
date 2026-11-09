import { ArtistSection } from './artist/Component'
import { Cards } from './cards/Component'
import { Divider } from './divider/Component'
import { Enquiry, loadEnquiry } from './enquiry/Component'
import { FaqSection, loadFaq } from './faq/Component'
import { Gallery } from './gallery/Component'
import { HomeHero } from './homeHero/Component'
import { ImageText } from './imageText/Component'
import { JournalList, loadJournalList } from './journalList/Component'
import { LatestPosts, loadLatestPosts } from './latestPosts/Component'
import { loadPageCta, PageCta } from './pageCta/Component'
import { PageHero } from './pageHero/Component'
import { loadPieceSuggestions, PieceSuggestions } from './pieceSuggestions/Component'
import { loadPortfolioGrid, PortfolioGrid } from './portfolioGrid/Component'
import { Steps } from './steps/Component'
import { TextSection } from './text/Component'
import { TextStrip } from './textStrip/Component'
import type { BlockEntry, BlockType } from './types'
import { loadWorkShowcase, WorkShowcase } from './workShowcase/Component'

/*
 * How each block renders (server side). The block definitions for the CMS are in ./index.ts.
 * `numbered` blocks count in a page's "01 / …" numbering; `hero` blocks are page tops.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each entry is typed by its key
export const registry: { [K in BlockType]: BlockEntry<K, any> } = {
  homeHero: { Component: HomeHero, hero: true },
  pageHero: { Component: PageHero, hero: true },
  textStrip: { Component: TextStrip },
  text: { Component: TextSection, numbered: true },
  imageText: { Component: ImageText, numbered: true },
  cards: { Component: Cards, numbered: true },
  steps: { Component: Steps, numbered: true },
  faq: { Component: FaqSection, load: loadFaq, numbered: true },
  latestPosts: { Component: LatestPosts, load: loadLatestPosts, numbered: true },
  journalList: { Component: JournalList, load: loadJournalList },
  workShowcase: { Component: WorkShowcase, load: loadWorkShowcase, numbered: true },
  portfolioGrid: { Component: PortfolioGrid, load: loadPortfolioGrid },
  gallery: { Component: Gallery, numbered: true },
  artist: { Component: ArtistSection, numbered: true },
  pieceSuggestions: { Component: PieceSuggestions, load: loadPieceSuggestions },
  enquiry: { Component: Enquiry, load: loadEnquiry, numbered: true },
  pageCta: { Component: PageCta, load: loadPageCta },
  divider: { Component: Divider },
}
