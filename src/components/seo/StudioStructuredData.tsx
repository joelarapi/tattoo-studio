import { getPortfolioItems } from '@/lib/data'
import { SCHEMA_DAYS } from '@/lib/format'
import { getCanonicalOrigin } from '@/lib/site-url'
import type { Media, PortfolioItem, SiteSetting } from '@/payload-types'

const preferredPortfolioSlugs = [
  'grim-reaper-full-back-tattoo',
  'archangel-mary-full-sleeve-tattoo',
  'family-memory-full-sleeve-tattoo',
]

/** Exclude the original drafting graphics, including placeholder-og-1.jpg. */
function genuinePhotoUrl(image: Media | number | null | undefined): string | undefined {
  if (!image || typeof image !== 'object' || !image.url) return undefined
  if (image.mimeType && !image.mimeType.startsWith('image/')) return undefined
  if (/placeholder[-_]/i.test([image.filename, image.alt, image.url].join(' '))) return undefined
  return image.url
}

/** Use a real CMS photo for the business schema, never a seed placeholder. */
async function businessPhotoUrl(settings: SiteSetting): Promise<string | undefined> {
  const selectedShareImage = genuinePhotoUrl(settings.seo?.ogImage)
  if (selectedShareImage) return selectedShareImage

  const pieces = await getPortfolioItems()
  const preferred = preferredPortfolioSlugs
    .map((slug) => pieces.find((item) => item.slug === slug))
    .filter((item): item is PortfolioItem => Boolean(item))

  for (const piece of [...preferred, ...pieces]) {
    const photo = [...(piece.images ?? []), piece.videoPoster]
      .map(genuinePhotoUrl)
      .find((url): url is string => Boolean(url))
    if (photo) return photo
  }
  // If there is no genuine photo, omit the property instead of advertising a placeholder.
  return undefined
}

/** One business identity shared by all public pages. */
export async function StudioStructuredData({ settings }: { settings: SiteSetting }) {
  const url = new URL('/', getCanonicalOrigin()).href
  const address = settings.address
  const imagePath = await businessPhotoUrl(settings)
  const phone = settings.phone?.trim()
  const email = settings.email?.trim()
  const sameAs = settings.socialLinks?.map(({ url }) => url).filter(Boolean)
  const openingHours = settings.openingHours?.map(({ days, opens, closes }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days.map((day) => SCHEMA_DAYS[day]),
    opens,
    closes,
  }))

  const business = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    '@id': new URL('#studio', url).href,
    name: settings.studioName,
    url,
    description: settings.seo?.description || undefined,
    image: imagePath ? new URL(imagePath, url).href : undefined,
    // The CMS may still contain the original demo contact values.
    telephone: phone && !/0{7}$/.test(phone.replace(/\D/g, '')) ? phone : undefined,
    email: email && !/@example\.(com|net|org)$/i.test(email) ? email : undefined,
    address: address && {
      '@type': 'PostalAddress',
      streetAddress: address.street?.trim() || undefined,
      addressLocality: address.city,
      postalCode: address.postcode?.trim() || undefined,
      addressCountry: address.country,
    },
    openingHoursSpecification: openingHours?.length ? openingHours : undefined,
    hasMap: settings.googleMapsUrl || undefined,
    sameAs: sameAs?.length ? sameAs : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }}
    />
  )
}
