import Link from 'next/link'

import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { instagramHandle } from '@/lib/format'
import type { Artist, Homepage } from '@/payload-types'

type ArtistsSectionProps = {
  copy: Homepage['artists']
  artists: Artist[]
}

export function ArtistsSection({ copy, artists }: ArtistsSectionProps) {
  if (artists.length === 0) return null
  return (
    <section id="artists" aria-labelledby="artists-heading" className="py-section-lg">
      <Container>
        <SectionHeading
          id="artists-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          muted={copy.headingMuted}
        />
        <ul className="mt-14 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((artist) => {
            const handle = instagramHandle(artist.instagram)
            const specialities = (artist.specialities ?? [])
              .map((style) => (typeof style === 'object' ? style.name : null))
              .filter(Boolean)
            return (
              <li
                key={artist.id}
                data-reveal=""
                data-fade=""
                className="group relative flex flex-col rounded-md bg-surface p-3"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-bg">
                  <CmsImage
                    media={artist.portrait}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-studio group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-3 pt-5 pb-3">
                  <h3 className="text-h5">
                    {/* The whole card is clickable via this link's ::after. */}
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="after:absolute after:inset-0 after:rounded-md"
                    >
                      {artist.name}
                    </Link>
                  </h3>
                  {specialities.length > 0 && (
                    <p className="mono-label-sm text-text-muted">{specialities.join(' · ')}</p>
                  )}
                  {handle && artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 mt-auto self-start pt-3 mono-label-sm text-text normal-case underline-offset-4 hover:underline"
                    >
                      {handle}
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
