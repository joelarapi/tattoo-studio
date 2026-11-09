import { Inter } from 'next/font/google'

/*
 * Self-hosted at build time by next/font. Inter sets the small uppercase labels; headings and body
 * use the system Arial/Helvetica, as in the design. The latin subset covers Albanian (ë, ç).
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
