import { notFound, permanentRedirect } from 'next/navigation'

import { TattooTripPage, type TattooTripGuide } from '@/components/guides/TattooTripPage'
import { getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'

const countries = ['germany', 'poland'] as const
type Country = (typeof countries)[number]
type Props = { params: Promise<{ country: string }> }

const guides: Record<Country, TattooTripGuide> = {
  germany: {
    country: 'Germany',
    language: 'German',
    flightCopy:
      'Compare departures near you, including Berlin, Frankfurt or airports in southern Germany. Munich and Memmingen are separate airports, so check the airport code as well as the fare. Confirm the flight on the airline’s own booking calendar.',
    entryCopy:
      'The German Foreign Office currently lists a German passport or national identity card as accepted for entry, subject to validity requirements. If you live in Germany with another nationality, check the rules for your own passport. Review the',
    entrySource: 'https://www.auswaertiges-amt.de/de/reiseundsicherheit/albaniensicherheit-216248',
  },
  poland: {
    country: 'Poland',
    language: 'Polish',
    flightCopy:
      'Compare departures convenient to you, such as Warsaw, Kraków or Katowice, and check whether your route is direct or has a connection. Look at the arrival time in Tirana before booking. Confirm the flight on the airline’s own booking calendar.',
    entryCopy:
      'Poland’s government lists a valid passport or national ID card for Polish citizens entering Albania, with document validity requirements. If you live in Poland with another nationality, check the rules for your own passport. Review the',
    entrySource: 'https://www.gov.pl/web/albania/praca-i-pobyt',
  },
}

async function findGuide(params: Props['params']) {
  const { country } = await params
  if (country === 'from-italy') permanentRedirect('/visiting-albania/from-italy')
  const key = countries.find((value) => country === `from-${value}`)
  if (!key) notFound()
  return { key, guide: guides[key] }
}

export function generateStaticParams() {
  return countries.map((country) => ({ country: `from-${country}` }))
}

export async function generateMetadata({ params }: Props) {
  const { key, guide } = await findGuide(params)
  const settings = await getSiteSettings()
  return pageMetadata({
    settings,
    path: `/visit/from-${key}`,
    fallbackTitle: `Tattoo trip from ${guide.country} to Albania`,
    fallbackDescription: `Plan a tattoo visit from ${guide.country} to ${settings.studioName} in Albania. Explore real portfolio work, flights to Tirana, appointment planning and aftercare.`,
  })
}

export default async function CountryGuide({ params }: Props) {
  const { guide } = await findGuide(params)
  return <TattooTripPage guide={guide} />
}
