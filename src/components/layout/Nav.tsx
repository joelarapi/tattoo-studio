import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import type { Navigation, SiteSetting, Style } from '@/payload-types'

import { Disclosure } from './Disclosure'
import { NavBackdrop } from './NavBackdrop'

type NavProps = {
  navigation: Navigation
  settings: SiteSetting
  styles: Pick<Style, 'id' | 'name' | 'slug'>[]
}

const linkClass =
  'mono-label text-text-muted transition-colors duration-300 hover:text-text focus-visible:text-text'

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-3 transition-transform duration-300 group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  )
}

/**
 * Fixed top navigation. Deliberately plain: no line art, grid or decorative SVG here; the hero's
 * line art starts below it.
 */
export function Nav({ navigation, settings, styles }: NavProps) {
  const links = navigation.header?.links ?? []
  const cta = navigation.header?.cta

  return (
    <header className="fixed inset-x-0 top-0 z-50 animate-[nav-in_0.6s_var(--ease-studio)_both] motion-reduce:animate-none">
      <NavBackdrop />
      <div className="mx-auto flex h-nav max-w-site items-center justify-between gap-6 px-site-margin">
        <Link href="/" aria-label={`${settings.studioName}, home`} className="rounded-sm">
          <Logo name={settings.studioName} logo={settings.logo} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) =>
              link.type === 'styles' ? (
                <li key={link.id} className="relative">
                  <Disclosure
                    summary={
                      <span className={`flex items-center gap-1.5 ${linkClass}`}>
                        {link.label}
                        <Chevron />
                      </span>
                    }
                  >
                    <div className="absolute top-full left-1/2 mt-5 w-60 -translate-x-1/2 rounded-md border border-surface-2 bg-surface p-2">
                      <ul>
                        {styles.map((style) => (
                          <li key={style.id}>
                            <Link
                              href={`/styles/${style.slug}`}
                              className="block rounded-sm px-3 py-2.5 mono-label text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:bg-surface-2 focus-visible:text-text"
                            >
                              {style.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Disclosure>
                </li>
              ) : (
                <li key={link.id}>
                  <Link href={link.href ?? '/'} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          {cta?.label && cta.href && (
            <Button href={cta.href} size="sm">
              {cta.label}
            </Button>
          )}
        </nav>

        <Disclosure
          className="lg:hidden"
          lockScroll
          summaryLabel="Menu"
          summaryClassName="-mr-2 grid size-11 place-items-center rounded-sm text-text"
          summary={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 8h16M4 16h16" className="group-open:hidden" />
              <path d="m6 6 12 12M18 6 6 18" className="hidden group-open:block" />
            </svg>
          }
        >
          <div className="fixed inset-x-0 top-nav bottom-0 overflow-y-auto bg-bg px-site-margin pt-8 pb-12">
            <nav aria-label="Main">
              <ul className="flex flex-col">
                {links.map((link) =>
                  link.type === 'styles' ? (
                    <li key={link.id} className="border-b border-surface-2 py-5">
                      <p className="mono-label-sm text-text-muted">{link.label}</p>
                      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                        {styles.map((style) => (
                          <li key={style.id}>
                            <Link
                              href={`/styles/${style.slug}`}
                              className="block py-1.5 text-large text-text"
                            >
                              {style.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={link.id} className="border-b border-surface-2">
                      <Link href={link.href ?? '/'} className="block py-5 text-h5 text-text">
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              {cta?.label && cta.href && (
                <Button href={cta.href} className="mt-10 w-full">
                  {cta.label}
                </Button>
              )}
            </nav>
          </div>
        </Disclosure>
      </div>
    </header>
  )
}
