import type { Metadata } from 'next'

import { FaqSection } from '@/components/faq/FaqSection'
import { ContactDetail, EnquirySection } from '@/components/forms/EnquirySection'
import { HomeHero } from '@/components/home/HomeHero'
import {
  ArtistSection,
  JournalSection,
  PlanSection,
  VisitSection,
  WorkSection,
} from '@/components/home/Sections'
import { MobileCta } from '@/components/motion/MobileCta'
import { Action } from '@/components/ui/Action'
import { EndCta, NeedleDivider } from '@/components/ui/Blocks'
import { Paragraphs } from '@/components/ui/Text'
import {
  getContactPage,
  getFaqs,
  getHomepage,
  getLatestPosts,
  getPortfolioItems,
  getSiteSettings,
} from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import type { PortfolioItem } from '@/payload-types'

/** The populated pieces of a relationship field (IDs mean the piece is unpublished or deleted). */
const populated = (value: (number | PortfolioItem)[] | null | undefined) =>
  (value ?? []).filter((item): item is PortfolioItem => typeof item === 'object')

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomepage(), getSiteSettings()])
  return pageMetadata({ settings, meta: home.meta, path: '/' })
}

/** The homepage: every text from Pages → Homepage, every list from its collection. */
export default async function HomePage() {
  const [home, settings, contact, portfolio, faqs, posts] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getContactPage(),
    getPortfolioItems(),
    getFaqs('home'),
    getLatestPosts(3),
  ])

  // The pieces chosen in Pages → Homepage → Portfolio, or the start of the portfolio.
  const chosen = populated(home.work.pieces)
  const pieces = chosen.length ? chosen : portfolio.slice(0, 9)
  const films = populated(home.films?.pieces).filter((item) => item.video && item.videoPoster)

  // Sections are numbered in the order they appear; empty ones drop out of the count.
  const shown = {
    work: pieces.length > 0 || films.length > 0,
    artist: true,
    visit: true,
    plan: true,
    enquiry: true,
    faq: faqs.length > 0,
    journal: posts.length > 0,
  }
  const numbers = Object.fromEntries(
    Object.entries(shown)
      .filter(([, visible]) => visible)
      .map(([key], index) => [key, index + 1]),
  ) as Record<keyof typeof shown, number>
  const location = [settings.address?.city, settings.address?.country].filter(Boolean).join(', ')

  return (
    <main id="main">
      <HomeHero hero={home.hero} strip={home.strip} />
      <WorkSection
        copy={home.work}
        pieces={pieces}
        filmCopy={home.films}
        films={films}
        number={numbers.work}
      />
      <ArtistSection copy={home.meetArtist} number={numbers.artist} />

      <VisitSection copy={home.visit} number={numbers.visit} />
      <NeedleDivider />
      <PlanSection copy={home.plan} number={numbers.plan} />

      <EnquirySection
        tag={home.enquiry.tag}
        number={numbers.enquiry}
        heading={home.enquiry.heading}
        intro={home.enquiry.intro}
        form={contact.form}
        projects={portfolio}
        className="border-y border-[#222] bg-band"
      >
        <ContactDetail label={settings.studioName} title={location && `${location}.`}>
          <Paragraphs text={home.enquiry.detailText} />
        </ContactDetail>
        <Action link={home.enquiry.contactLink} variant="plain" className="mt-[30px]" />
      </EnquirySection>

      <FaqSection copy={home.faq} faqs={faqs} number={numbers.faq} />
      <NeedleDivider />
      <JournalSection copy={home.journal} posts={posts} number={numbers.journal} />
      <EndCta cta={home.finalCta} />
      <MobileCta label={home.mobileCta.label} href={home.mobileCta.href} />
    </main>
  )
}
