import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Homepage, PortfolioItem } from '@/payload-types'

import { type WorkItem, WorkSlider } from './WorkSlider'

type FeaturedWorkProps = {
  copy: Homepage['featuredWork']
  items: PortfolioItem[]
}

function toWorkItem(item: PortfolioItem, i: number): WorkItem {
  const artist = typeof item.artist === 'object' ? item.artist : null
  const style = typeof item.style === 'object' ? item.style : null
  const image = item.images.find((media) => typeof media === 'object') ?? null
  const video = typeof item.video === 'object' && item.video?.url ? item.video : null
  return {
    id: item.id,
    title: item.title,
    index: String(i + 1).padStart(3, '0'),
    href: artist ? `/artists/${artist.slug}` : '/',
    artist: artist?.name ?? '',
    style: style?.name ?? '',
    image: typeof image === 'object' ? image : null,
    video: video ? { url: video.url!, mimeType: video.mimeType ?? 'video/mp4' } : null,
  }
}

export function FeaturedWork({ copy, items }: FeaturedWorkProps) {
  if (items.length === 0) return null
  return (
    <section id="work" aria-labelledby="work-heading" className="overflow-hidden py-section-lg">
      <Container>
        <SectionHeading
          id="work-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          intro={copy.intro}
          align="center"
        />
      </Container>
      <div className="mt-14">
        <WorkSlider items={items.map(toWorkItem)} label={copy.heading} />
      </div>
    </section>
  )
}
