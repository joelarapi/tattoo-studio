import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'

import { GoogleTagManager } from '@/components/analytics/GoogleTagManager'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageMotion } from '@/components/motion/PageMotion'
import { StudioStructuredData } from '@/components/seo/StudioStructuredData'
import { getNavigation, getSiteSettings } from '@/lib/data'
import { defaultLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/metadata'
import { getCanonicalOrigin } from '@/lib/site-url'

import { inter } from './fonts'
import './globals.css'

/*
 * Runs before first paint. Adds `js-ready` so animated elements may start hidden. If the motion
 * script hasn't booted within 4 s (blocked or failed bundle), remove it so nothing stays hidden.
 */
const jsReadyScript = `(function(){var d=document.documentElement;d.classList.add('js-ready');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-ready')},4000)})()`

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  // Defaults for pages without their own metadata (e.g. 404s); pages set their canonical URL.
  return {
    metadataBase: new URL(getCanonicalOrigin()),
    ...pageMetadata({ settings, path: '/' }),
    alternates: null,
  }
}

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [navigation, settings, draft] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
    draftMode(),
  ])

  return (
    <html
      lang={defaultLocale}
      className={inter.variable}
      data-scroll-behavior="smooth"
      data-mono-photos={settings.monochromePhotos === false ? undefined : ''}
      // The inline script adds classes to <html> before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsReadyScript }} />
      </head>
      <body>
        {!draft.isEnabled && process.env.VERCEL_ENV === 'production' && (
          <GoogleTagManager
            id={settings.tracking?.gtmId || process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WJ9MVBNX'}
          />
        )}
        {!draft.isEnabled && <StudioStructuredData settings={settings} />}
        <a
          href="#main"
          className="sr-only z-[60] rounded-sm bg-white px-4 py-3 text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header navigation={navigation} settings={settings} />
        {children}
        <Footer navigation={navigation} settings={settings} />
        <PageMotion />
        {draft.isEnabled && <LivePreviewListener />}
      </body>
    </html>
  )
}
