import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { StudioGuide } from '@/components/guides/StudioGuide'
import { Action } from '@/components/ui/Action'
import { getPortfolioItems, getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { ENQUIRY_ID } from '@/lib/routes'
import { geometricGuide as guide } from '@/lib/studio-guides'

const path = '/services/geometric-tattoo'

export async function generateMetadata() {
  return pageMetadata({
    settings: await getSiteSettings(),
    fallbackTitle: guide.title,
    fallbackDescription: guide.description,
    path,
  })
}

export default async function GeometricTattooPage() {
  const items = (await getPortfolioItems())
    .filter((item) => typeof item.style === 'object' && item.style?.slug === 'geometric')
    .slice(0, 3)
  return (
    <StudioGuide guide={guide} enquiry={`/contact#${ENQUIRY_ID}`}>
      {items.length > 0 && (
        <section className="mt-14">
          <h2 className="text-h2-sm">Geometric work by Tisi</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {items.map((item, index) => (
              <PortfolioCard key={item.id} item={item} position={index + 1} />
            ))}
          </div>
        </section>
      )}
      <Action href="/portfolio#geometric" variant="outline" className="mt-8">
        Browse geometric tattoos
      </Action>
    </StudioGuide>
  )
}
