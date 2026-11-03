import { Roboto, Roboto_Mono } from 'next/font/google'

// Self-hosted at build time by next/font. The latin subset covers Albanian (ë, ç) for later.
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-roboto-mono',
})
