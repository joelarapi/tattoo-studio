import type { Navigation, SiteSetting } from '@/payload-types'

import { STUDIO_NAME } from './content'
import { doc, link, p } from './lexical'

/* Studio details and menus. The pages themselves are in pages.ts. */

type Seed<T> = Omit<T, 'id'>

const contactEnquiry = '/contact#tattoo-enquiry'

export const siteSettings = (refs: { og: number }): Seed<SiteSetting> => ({
  studioName: STUDIO_NAME,
  brandParagraph: 'Your skin. Your story.',
  monochromePhotos: true,
  address: { city: 'Fier', country: 'Albania' },
  phone: '+355 69 000 0000',
  email: 'hello@example.com',
  endCta: {
    tag: 'Your next chapter',
    heading: { text: 'It starts with', accent: 'your idea.' },
    button: { label: 'Tell us about your tattoo', href: contactEnquiry },
    note: 'Explore your direction. Share your idea when you’re ready.',
  },
  enquiryForm: {
    submitLabel: 'Send my tattoo enquiry',
    helperText: 'We reply by phone or email. An enquiry doesn’t book an appointment.',
    privacyNote: doc(
      p('We use your details only to reply to your enquiry. ', link('Privacy policy', '/privacy')),
    ),
    pendingNotice:
      'Online enquiries aren’t connected yet. For now, please contact the studio by phone or email.',
    successHeading: 'Thank you. Your idea is with us.',
    successMessage: 'We’ll be in touch to talk through the details.',
  },
  notFound: {
    heading: { text: 'Lost the line?', soft: 'This page doesn’t exist.' },
    text: 'The link may be old or mistyped. Start again from the homepage, or explore the work.',
    button: { label: 'Back to the homepage', href: '/' },
  },
  seo: {
    titleTemplate: `%s | ${STUDIO_NAME}`,
    description: `Tattoo studio in Fier, Albania. Meet Tisi, an artist with 18 years of experience, explore the portfolio and send your tattoo idea.`,
    ogImage: refs.og,
  },
})

export const navigation = (): Seed<Navigation> => ({
  header: {
    links: [
      { label: 'Home', href: '/' },
      { label: 'About us', href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Visiting Albania', href: '/visiting-albania' },
      { label: 'Blog', href: '/journal' },
    ],
    cta: { label: 'Contact', href: '/contact' },
  },
  footer: {
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Visiting Albania', href: '/visiting-albania' },
      { label: 'Blog', href: '/journal' },
      { label: 'Contact', href: contactEnquiry },
    ],
    legalLine: `© {year} ${STUDIO_NAME} · Fier, Albania`,
    legalLinks: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
})
