import { Action } from '@/components/ui/Action'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Paragraphs } from '@/components/ui/Text'
import { getSiteSettings } from '@/lib/data'

/** The site's 404 page, with copy from Studio details → Shared sections. */
export default async function NotFound() {
  const settings = await getSiteSettings()
  const copy = settings.notFound
  return (
    <main
      id="main"
      className="grid-bg flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-[6%] py-section text-center"
    >
      <span className="mb-6 rounded-[5px] border border-line bg-panel-2 px-4 py-2.5 label-xs text-accent md:text-[10px]">
        404
      </span>
      <StyledHeading as="h1" value={copy?.heading} className="text-cta" />
      <Paragraphs
        text={copy?.text}
        className="mt-[23px] max-w-[520px] text-[14px] md:text-[16px]"
      />
      <Action link={copy?.button} className="mt-[30px]" />
    </main>
  )
}
