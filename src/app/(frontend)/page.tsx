import type { Metadata } from 'next'

import { FaqSection } from '@/components/faq/FaqSection'
import { ContactDetail, EnquirySection } from '@/components/forms/EnquirySection'
import { HomeHero } from '@/components/home/HomeHero'
import { ReelsTrack } from '@/components/home/ReelsTrack'
import {
  ArtistSection,
  JournalSection,
  PlanSection,
  VisitSection,
  WorkSection,
} from '@/components/home/Sections'
import { MobileCta } from '@/components/motion/MobileCta'
import { Action } from '@/components/ui/Action'
import { EndCta, NeedleDivider, SectionHead } from '@/components/ui/Blocks'
import { CmsImage } from '@/components/ui/CmsImage'
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

  const featured = portfolio.filter((item) => item.featured)
  const work = featured.length ? featured : portfolio
  const positions = new Map(portfolio.map((item, index) => [item.id, index + 1]))
  const reels = (home.reels.items ?? []).map((reel) => {
    const poster = typeof reel.poster === 'object' ? reel.poster : null
    const video = typeof reel.video === 'object' && reel.video?.url ? reel.video : null
    return {
      id: reel.id ?? reel.title,
      title: reel.title,
      text: reel.text,
      video: video ? { url: video.url!, mimeType: video.mimeType } : null,
      posterURL: poster?.sizes?.hero?.url ?? poster?.url,
      poster: (
        <CmsImage
          media={poster}
          alt=""
          fill
          sizes="(min-width: 681px) 33vw, 86vw"
          className="object-cover"
        />
      ),
    }
  })

  // Sections are numbered in the order they appear; empty ones drop out of the count.
  const shown = {
    work: work.length > 0,
    artist: true,
    reels: reels.length > 0,
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
      <WorkSection copy={home.work} items={work} positions={positions} number={numbers.work} />
      <NeedleDivider />
      <ArtistSection copy={home.meetArtist} number={numbers.artist} />

      {reels.length > 0 && (
        <section className="border-y border-[#252525] bg-band px-site py-section">
          <SectionHead
            tag={home.reels.tag}
            number={numbers.reels}
            heading={home.reels.heading}
            intro={home.reels.intro}
          />
          <ReelsTrack
            reels={reels}
            trackLabel={home.reels.trackLabel}
            itemLabel={home.reels.itemLabel}
            watchLabel={home.reels.watchLabel}
            comingSoonLabel={home.reels.comingSoonLabel}
            dialogLink={home.reels.dialogLink}
          />
        </section>
      )}

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
