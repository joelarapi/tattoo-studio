import { draftMode } from 'next/headers'

import { ArtistsSection } from '@/components/home/ArtistsSection'
import { Booking } from '@/components/home/Booking'
import { Faq } from '@/components/home/Faq'
import { FeaturedWork } from '@/components/home/FeaturedWork'
import { Hero } from '@/components/home/Hero'
import { Journal } from '@/components/home/Journal'
import { ProcessSection } from '@/components/home/ProcessSection'
import { Standards } from '@/components/home/Standards'
import { Statement } from '@/components/home/Statement'
import { StudioNumbers } from '@/components/home/StudioNumbers'
import { StylesGrid } from '@/components/home/StylesGrid'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import {
  getArtists,
  getFeaturedStyles,
  getFeaturedWork,
  getHomepage,
  getHomepageFaqs,
  getLatestPosts,
  getStyles,
} from '@/lib/data'

/** The homepage: every text from Homepage in the CMS, every list from its collection. */
export default async function HomePage() {
  const [home, work, featuredStyles, allStyles, artists, posts, faqs, draft] = await Promise.all([
    getHomepage(),
    getFeaturedWork(),
    getFeaturedStyles(),
    getStyles(),
    getArtists(),
    getLatestPosts(3),
    getHomepageFaqs(),
    draftMode(),
  ])
  const poster = typeof home.hero.poster === 'object' ? home.hero.poster?.url : null
  const featuredArtists = artists.filter((artist) => artist.featured).slice(0, 4)

  return (
    <main id="main">
      {draft.isEnabled && <LivePreviewListener />}
      <Hero hero={home.hero} />
      <ProcessSection process={home.process} posterSrc={poster} />
      <FeaturedWork copy={home.featuredWork} items={work} />
      <StylesGrid copy={home.styles} styles={featuredStyles} />
      <StudioNumbers copy={home.numbers} />
      <Statement copy={home.statement} />
      <ArtistsSection copy={home.artists} artists={featuredArtists} />
      <Standards copy={home.standards} />
      <Journal copy={home.journal} posts={posts} />
      <Faq copy={home.faq} faqs={faqs} />
      <Booking copy={home.booking} styles={allStyles} artists={artists} />
    </main>
  )
}
