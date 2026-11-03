import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { MotionProvider } from '@/components/motion/MotionProvider'
import { defaultLocale } from '@/lib/i18n'

import { roboto, robotoMono } from './fonts'
import './globals.css'

/*
 * Runs before first paint. Adds `js-ready` so animated elements may start hidden. If motion
 * code hasn't booted within 4 s (blocked or failed bundle), remove it so nothing stays hidden.
 */
const jsReadyScript = `(function(){var d=document.documentElement;d.classList.add('js-ready');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-ready')},4000)})()`

// Placeholder until the SEO phase builds metadata from the CMS (site-settings).
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Tattoo studio',
  description: 'Custom tattoos by resident artists.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      className={`${roboto.variable} ${robotoMono.variable}`}
      // The inline script adds classes to <html> before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsReadyScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
