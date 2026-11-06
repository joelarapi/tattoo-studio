import type { Homepage, Navigation, SiteSetting } from '@/payload-types'

import { STUDIO_NAME } from './content'
import { doc, link, p } from './lexical'

type Media = { stats: number[]; og: number }

/*
 * Homepage section anchors used below (the sections get these ids in Phase 4):
 * #process #work #styles #numbers #studio #artists #standards #journal #faq #book
 */

export const homepage = (media: Media): Omit<Homepage, 'id'> => ({
  hero: {
    eyebrow: 'Custom tattoos in Tirana',
    eyebrowLink: { label: 'Book now', href: '#book' },
    heading: 'Your story, permanently drawn',
    intro:
      'Original tattoos designed with you and drawn by hand, in a private studio in the centre of Tirana.',
    cta: { label: 'Book a consult', href: '#book' },
    scrollLabel: 'Scroll to begin',
  },
  process: {
    heading: 'From first idea to healed skin',
    sequence: 'placeholder',
    steps: [
      {
        label: 'Free · 30 min',
        heading: 'Consultation',
        text: 'Tell us the idea, the placement and the size. We talk through style and timing, and you leave with a clear quote.',
      },
      {
        label: 'Drawn for you',
        heading: 'Custom design',
        text: 'Your artist draws an original design and refines it with you. Nothing goes on skin until you say yes.',
      },
      {
        label: 'Session day',
        heading: 'Stencil & ink',
        text: 'We place a stencil, check it from every angle, then tattoo with sterile single-use needles in a private room.',
      },
      {
        label: 'Aftercare',
        heading: 'Heal & keep',
        text: 'You go home with written aftercare and a direct line to your artist while it heals.',
      },
    ],
  },
  featuredWork: {
    eyebrow: 'Selected work',
    heading: 'Fresh from the studio',
    intro: 'Recent pieces by our resident artists.',
  },
  styles: {
    heading: 'What we tattoo',
    button: { label: 'See all work', href: '#work' },
  },
  numbers: {
    eyebrow: 'Studio in numbers',
    heading: 'Small studio, steady hands',
    stats: [
      { value: 9, unit: '', text: 'years tattooing in Tirana', image: media.stats[0] },
      { value: 4000, unit: '+', text: 'tattoos completed', image: media.stats[1] },
      { value: 4.9, unit: '★', text: 'average Google rating', image: media.stats[2] },
      { value: 4, unit: '', text: 'resident artists', image: media.stats[3] },
    ],
  },
  statement: {
    eyebrow: 'Craft, hygiene & artistry',
    headingLine1: 'Where the needle',
    headingLine2: 'meets the story',
    text: 'Every piece starts as a conversation and ends as something you wear for life. We take the time to get both right.',
    secondaryButton: { label: 'Our studio', href: '#standards' },
    primaryButton: { label: 'Book a consult', href: '#book' },
  },
  artists: {
    eyebrow: 'Resident artists',
    heading: 'Four artists, one standard.',
    headingMuted: 'Find the hand that fits your idea.',
  },
  standards: {
    eyebrow: 'Our standards',
    heading: 'Clean, safe and done properly',
    items: [
      {
        icon: 'needle',
        title: 'Single-use needles',
        text: 'Every needle is sterile, opened in front of you and disposed of after your session.',
      },
      {
        icon: 'ink',
        title: 'Vegan inks',
        text: 'We use vegan, high-pigment inks from established European suppliers.',
      },
      {
        icon: 'certificate',
        title: 'Licensed artists',
        text: 'Our artists are trained in hygiene and first aid, and hold the licences required to tattoo.',
      },
      {
        icon: 'aftercare',
        title: 'Aftercare support',
        text: 'Questions while it heals? Message your artist directly; we reply within a day.',
      },
    ],
  },
  journal: {
    eyebrow: 'Journal',
    heading: 'Notes from the studio',
    button: { label: 'Read the journal', href: '/journal' },
  },
  faq: { eyebrow: 'FAQ', heading: 'Questions we hear every week' },
  booking: {
    eyebrow: 'Book a consultation',
    heading: 'Ready when you are',
    intro:
      'Tell us about your idea. We reply within one working day to arrange a consultation, in the studio or by video call.',
    submitLabel: 'Send request',
    privacyNote: doc(
      p(
        'We only use your details to reply to this request. Read our ',
        link('privacy policy', '/privacy'),
        '.',
      ),
    ),
    successHeading: 'Request received',
    successMessage:
      'Thank you. Your artist will be in touch within one working day, usually on WhatsApp.',
    redirectToThankYou: false,
  },
  meta: {
    title: `${STUDIO_NAME} | Custom tattoos in Tirana`,
    description:
      'Custom tattoos in Tirana by resident artists: fine line, blackwork, realism and traditional. Book a consultation online.',
    image: media.og,
  },
  _status: 'published',
})

export const siteSettings = (media: Media): Omit<SiteSetting, 'id'> => ({
  studioName: STUDIO_NAME,
  brandParagraph:
    'A private tattoo studio in Tirana. Original designs, drawn by hand and tattooed with care by resident artists.',
  priceRange: '€€',
  address: {
    street: 'Rruga e Durrësit',
    city: 'Tirana',
    postcode: '1001',
    country: 'Albania',
  },
  geo: { lat: 41.3275, lng: 19.8187 },
  phone: '+355 69 000 0000',
  whatsapp: '+355 69 000 0000',
  email: 'hello@example.com',
  googleMapsUrl: 'https://www.google.com/maps?q=41.3275,19.8187',
  openingHours: [
    { days: ['tue', 'wed', 'thu', 'fri'], opens: '11:00', closes: '20:00' },
    { days: ['sat'], opens: '10:00', closes: '18:00' },
  ],
  socialLinks: [
    { platform: 'instagram', url: 'https://www.instagram.com/example.studio' },
    { platform: 'facebook', url: 'https://www.facebook.com/example.studio' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@example.studio' },
  ],
  seo: {
    titleTemplate: `%s | ${STUDIO_NAME}`,
    description:
      'Custom tattoos in Tirana by resident artists: fine line, blackwork, realism and traditional. Book a consultation online.',
    ogImage: media.og,
  },
  tracking: {},
})

export const navigation = (): Omit<Navigation, 'id'> => ({
  header: {
    links: [
      { type: 'styles', label: 'Styles' },
      { type: 'link', label: 'Artists', href: '/#artists' },
      { type: 'link', label: 'Work', href: '/#work' },
      { type: 'link', label: 'Journal', href: '/journal' },
      { type: 'link', label: 'Studio', href: '/#studio' },
    ],
    cta: { label: 'Book a consult', href: '/#book' },
  },
  footer: {
    columns: [
      {
        title: 'Navigation',
        type: 'links',
        links: [
          { label: 'Artists', href: '/#artists' },
          { label: 'Work', href: '/#work' },
          { label: 'Journal', href: '/journal' },
          { label: 'Studio', href: '/#studio' },
          { label: 'Book a consult', href: '/#book' },
        ],
      },
      { title: 'Styles', type: 'styles' },
    ],
    newsletter: {
      title: 'Newsletter',
      text: 'New flash designs, guest artists and open booking dates. One email a month.',
      buttonLabel: 'Subscribe',
      consentLabel: 'I agree to receive emails and can unsubscribe at any time.',
    },
    contactTitle: 'Contact',
    legalLine: `© {year} ${STUDIO_NAME}. All rights reserved.`,
    legalLinks: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
})
