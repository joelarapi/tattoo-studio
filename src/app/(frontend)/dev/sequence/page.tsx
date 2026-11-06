import type { Metadata } from 'next'

import { ScrollSequence } from '@/components/scroll-sequence/ScrollSequence'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { getPayloadClient } from '@/lib/payload'

// Test bench for <ScrollSequence> (build phase 3). Remove before launch.
export const metadata: Metadata = {
  title: 'Scroll sequence test',
  robots: { index: false, follow: false },
}

export default async function SequenceTestPage() {
  const payload = await getPayloadClient()
  const { hero, process } = await payload.findGlobal({ slug: 'homepage', depth: 1 })
  const poster = typeof hero.poster === 'object' ? hero.poster?.url : null

  return (
    <main id="main">
      <Container className="flex min-h-[45svh] flex-col justify-end gap-4 pt-nav pb-section">
        <Eyebrow>Dev · remove before launch</Eyebrow>
        <h1 className="text-h2">Scroll sequence test</h1>
        <p className="max-w-[60ch] text-large">
          Scroll through the process animation below. Frames load progressively from about one
          viewport away; the steps come from the CMS (Homepage → Process).
        </p>
      </Container>

      <section aria-labelledby="process-heading">
        <h2 id="process-heading" className="sr-only">
          {process.heading}
        </h2>
        <ScrollSequence
          name={process.sequence || 'placeholder'}
          steps={process.steps}
          posterSrc={poster}
        />
      </section>

      <Container className="flex min-h-svh items-center">
        <p className="mono-label text-text">End of sequence</p>
      </Container>
    </main>
  )
}
