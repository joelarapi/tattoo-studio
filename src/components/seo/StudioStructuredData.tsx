import { SCHEMA_DAYS } from '@/lib/format'
import { getCanonicalOrigin } from '@/lib/site-url'
import type { SiteSetting } from '@/payload-types'

/** One business identity shared by all public pages. */
export function StudioStructuredData({ settings }: { settings: SiteSetting }) {
  const url = new URL('/', getCanonicalOrigin()).href
  const address = settings.address
  const image = settings.seo?.ogImage
  const imagePath = typeof image === 'object' ? image?.url : undefined
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
