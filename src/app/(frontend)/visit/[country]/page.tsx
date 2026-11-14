import { notFound } from 'next/navigation'

import { StudioGuide } from '@/components/guides/StudioGuide'
import { Action } from '@/components/ui/Action'
import { getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { ENQUIRY_ID } from '@/lib/routes'
import { travelGuides } from '@/lib/studio-guides'

const countries = ['italy', 'germany'] as const
type Country = (typeof countries)[number]
type Props = { params: Promise<{ country: string }> }

async function findGuide(params: Props['params']) {
  const { country } = await params
  const key = countries.find((value) => country === `from-${value}`)
  if (!key) notFound()
  return { key, guide: travelGuides[key] }
}

export function generateStaticParams() {
  return countries.map((country: Country) => ({ country: `from-${country}` }))
}

export async function generateMetadata({ params }: Props) {
  const { key, guide } = await findGuide(params)
  return pageMetadata({
    settings: await getSiteSettings(),
    fallbackTitle: guide.title,
    fallbackDescription: guide.description,
    path: `/visit/from-${key}`,
  })
}

export default async function CountryGuide({ params }: Props) {
  const { guide } = await findGuide(params)
  return (
    <StudioGuide guide={guide} enquiry={`/contact?travel=1#${ENQUIRY_ID}`}>
      <div className="mt-10 flex flex-wrap gap-6">
        <Action href="/visiting-albania" variant="plain">Read the Albania visitor guide</Action>
        <Action href="https://www.tirana-airport.com/en/flights" variant="plain">Check Tirana flights</Action>
        <Action href="https://www.tirana-airport.com/en/article/15/By-Bus" variant="plain">Check airport buses to Fier</Action>
      </div>
    </StudioGuide>
  )
}
