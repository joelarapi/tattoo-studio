import type { Navigation, SiteSetting } from '@/payload-types'

import { Disclosure } from './Disclosure'
import { NavLinks } from './NavLinks'
import { Wordmark } from './Wordmark'

/**
 * The site header: wordmark and the menu in a dark pill with the orange Contact button. Phones get
 * a "Menu +" button that opens the same links in a panel (a <details>, so it works without JS).
 */
export function Header({
  navigation,
  settings,
}: {
  navigation: Navigation
  settings: SiteSetting
}) {
  const links = navigation.header?.links ?? []
  const cta = navigation.header?.cta

  return (
    <header className="relative z-30 flex items-center justify-between gap-5 px-[6%] py-6 md:px-[4%] md:py-[25px] lg:py-7">
      <Wordmark settings={settings} />

      <nav aria-label="Main" className="hidden md:block">
        <NavLinks
          links={links}
          cta={cta}
          className="flex items-center gap-[18px] rounded-md bg-panel py-2 pr-2 pl-[22px] lg:gap-[26px]"
          linkClassName="font-label text-[9px] tracking-[0.3px] lg:text-[11px]"
          ctaClassName="text-[9px] lg:text-[11px]"
        />
      </nav>

      <Disclosure
        className="md:hidden"
        summary={
          <>
            <span className="group-open:hidden">Menu ＋</span>
            <span className="hidden group-open:inline">Close −</span>
          </>
        }
        summaryClassName="block rounded-sm border border-line-strong bg-[#191919] px-[13px] py-2.5 font-label text-[10px] tracking-[0.3px] text-text uppercase"
      >
        <nav
          aria-label="Main"
          className="absolute inset-x-[5%] top-[90px] rounded-md border border-line-strong bg-panel p-5"
        >
          <NavLinks
            links={links}
            cta={cta}
            className="flex flex-col gap-5"
            linkClassName="font-label text-[12px] tracking-[0.3px]"
            ctaClassName="text-center"
          />
        </nav>
      </Disclosure>
    </header>
  )
}
