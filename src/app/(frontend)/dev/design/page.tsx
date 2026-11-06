import type { Metadata } from 'next'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'

// Design-system check from Phase 1 (tokens and UI primitives). Remove before launch.
export const metadata: Metadata = {
  title: 'Design system check',
  robots: { index: false, follow: false },
}

export default function DesignSystemPage() {
  return (
    <main id="main" className="pt-nav">
      <Container as="section" aria-labelledby="hero-title" className="py-section-lg">
        <Eyebrow pill>Design system check · Phase 1</Eyebrow>
        <h1 id="hero-title" className="mt-8 max-w-[14ch] text-display">
          Your story, permanently drawn
        </h1>
        <p className="mt-6 max-w-[52ch] text-large">
          Scaffold preview: Roboto headings, Roboto Mono labels, the black and grey palette, and a
          single orange accent. Hover the buttons to see the label scramble.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="/admin">Book a consult</Button>
          <Button variant="secondary" href="/admin">
            Our studio
          </Button>
          <Button size="sm" href="/admin">
            Learn more
          </Button>
          <Button size="sm" variant="secondary" arrow={false}>
            Secondary small
          </Button>
          <Button asChild variant="secondary">
            <a href="https://payloadcms.com/docs" rel="noopener noreferrer" target="_blank">
              External (asChild)
            </a>
          </Button>
        </div>
      </Container>

      <Container as="section" aria-labelledby="tokens-title" className="pb-section">
        <Eyebrow>Tokens</Eyebrow>
        <h2 id="tokens-title" className="mt-4 text-h2">
          Type scale <span className="text-text-muted">and colour.</span>
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-gutter sm:grid-cols-5">
          {[
            ['bg-surface', 'Surface'],
            ['bg-surface-2', 'Surface 2'],
            ['bg-line', 'Line'],
            ['bg-muted', 'Muted'],
            ['bg-accent', 'Accent'],
          ].map(([swatch, label]) => (
            <li key={label} className="rounded-md bg-surface p-4">
              <span className={`block h-16 rounded-sm ${swatch}`} />
              <span className="mt-3 block mono-label-sm text-text-muted">{label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 space-y-4">
          <p className="text-h3 text-text">Heading three</p>
          <p className="text-h5 text-text">Heading five</p>
          <p className="text-main">Body copy in mid grey for long-form reading.</p>
          <p className="mono-label text-text-muted">001 · Mono label</p>
          <p className="mono-label-sm text-text-faint">Caption · faint (non-essential only)</p>
        </div>
      </Container>
    </main>
  )
}
