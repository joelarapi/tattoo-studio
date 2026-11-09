import type {
  AboutPage,
  ContactPage,
  Homepage,
  JournalPage,
  Navigation,
  PortfolioPage,
  SiteSetting,
  VisitingPage,
} from '@/payload-types'

import { STUDIO_NAME } from './content'
import { doc, link, p } from './lexical'

/** Media and documents the globals point at, created earlier in the seed. */
export type GlobalRefs = {
  og: number
  heroImages: [number, number]
  /** The image in the homepage's artist section, until Tisi's portrait arrives. */
  artistImage: number
  backgrounds: { about: number; portfolio: number; visiting: number; journal: number }
  homepagePieces: number[]
  homepageFilms: number[]
  artist: number
  featuredPost: number
}

type Seed<T> = Omit<T, 'id'>

const enquiry = '#tattoo-enquiry'
const contactEnquiry = '/contact#tattoo-enquiry'
const travelEnquiry = '/contact?travel=1#tattoo-enquiry'

export const homepage = (refs: GlobalRefs): Seed<Homepage> => ({
  hero: {
    label: `${STUDIO_NAME} / Albania`,
    heading: { text: 'Tattoos in Albania.', soft: 'Your story.', accent: 'Our artistry.' },
    intro: `At ${STUDIO_NAME}, we turn your ideas into reality with designs that reflect your story. We create tattoos you’ll never regret wearing.`,
    supporting:
      'Whether you live in Albania or are travelling here, start by showing us what you have in mind.',
    primaryCta: { label: 'Send your tattoo idea', href: enquiry },
    secondaryLink: { label: 'Explore the work', href: '#work' },
    factValue: '18',
    factLabel: 'Years of tattoo experience',
    secondFact: 'Meet Tisi.\nThe best tattoo artist in Albania',
    primaryImage: refs.heroImages[0],
    primaryCaption: 'The details make the difference.',
    secondaryImage: refs.heroImages[1],
    imagesLink: '/portfolio',
    artNote: 'Art. Identity. Expression.',
  },
  strip: [
    { text: 'Your skin. Your story.' },
    { text: '18 years of dedication.' },
    { text: 'Fier, Albania.' },
  ],
  work: {
    tag: 'Explore the portfolio',
    heading: { text: 'The work.', soft: 'It speaks for itself.' },
    intro:
      'Look closer at the lines, the contrast, the details.\nFind the direction that feels like you.',
    button: { label: 'View the full portfolio', href: '/portfolio' },
    creditLine: `Original work by Tisi / ${STUDIO_NAME}, Albania`,
    trackLabel: 'Photos · scroll at your own pace',
    pieces: refs.homepagePieces,
  },
  films: {
    trackLabel: 'Films · scroll at your own pace',
    itemLabel: 'Tisi / film',
    watchLabel: 'Watch the tattoo video',
    pieces: refs.homepageFilms,
  },
  meetArtist: {
    tag: 'Meet your artist',
    heading: { text: 'Tisi.', soft: 'The artist behind\nyour story.' },
    artist: refs.artist,
    image: refs.artistImage,
    imageNote: 'Original work by Tisi',
    text: `With 18 years of tattoo experience and an extensive body of work, Tisi creates personal tattoos at ${STUDIO_NAME} in Fier, Albania. His work spans large custom pieces, detailed portrait tattoos and full sleeves, with careful attention to composition, expression and the way a design follows the body.\n\nWe take time to discuss your idea. Bring your references, a starting point or simply a feeling you want to capture. If you are unsure where to begin, we can design something for you and work through the direction, placement and details together.`,
    button: { label: 'More about Tisi', href: '/about' },
  },
  visit: {
    tag: 'Make Albania part of your story',
    heading: { text: 'A trip to remember.', soft: 'A piece to', accent: 'take home.' },
    text: 'Already visiting Albania, or travelling for your tattoo? Start the conversation before you arrive.',
    button: { label: 'Share your idea & travel dates', href: travelEnquiry },
    steps: [
      {
        title: 'Start with the tattoo.',
        text: 'Share your idea, preferred placement and dates in Albania. Whether you’re coming from Italy, Germany, Switzerland or elsewhere, confirm availability before booking around an appointment.',
      },
      {
        title: 'Make room for the process.',
        text: 'Discuss the number of sessions, design review and time needed at the studio. Plan around a confirmed appointment.',
      },
      {
        title: 'Think beyond the session.',
        text: 'Tell your artist about beach days and onward travel. Ask how preparation and aftercare fit your itinerary.',
      },
    ],
    link: { label: 'Read the visitor guide', href: '/visiting-albania' },
  },
  plan: {
    tag: 'From idea to appointment',
    heading: { text: 'Let’s make', soft: 'a plan.' },
    intro:
      'Not every detail needs to be figured out.\nBring your starting point. Ask your questions.\nKnow what comes next.',
    cards: [
      {
        label: 'Your idea',
        icon: 'sketch',
        title: 'Tell us what matters.',
        text: 'Describe the subject and placement. Add reference photos or a video to help explain the direction you’re drawn to.',
      },
      {
        label: 'Your quote',
        icon: 'machine',
        title: 'Talk through the details.',
        text: 'Discuss your design, estimated cost, session plan and dates. Prices and deposit terms are confirmed directly with the studio.',
      },
      {
        label: 'Your appointment',
        icon: 'ink',
        title: 'Confirm, then plan.',
        text: 'An enquiry starts a conversation. Your appointment is only booked after confirmation. Ask about preparation and aftercare before your visit.',
      },
    ],
    priceNote: {
      title: 'What does a tattoo in Albania cost?',
      text: 'Design, detail and placement shape the quote. Ask for a personalised estimate and clear terms before confirming.',
      link: { label: 'Discuss your idea', href: enquiry },
    },
  },
  enquiry: {
    tag: 'Your next tattoo starts here',
    heading: { text: 'Got an idea?', accent: 'Make it yours.' },
    intro:
      'Tell us about your next tattoo. Choose your placement, add your inspiration and include any dates you have in mind.',
    detailText: 'Tattoo artist: Tisi · 18 years of experience.',
    contactLink: { label: 'Visit the contact page', href: '/contact' },
  },
  faq: {
    tag: 'Know before you book',
    heading: { text: 'A little clarity.', soft: 'Before the ink.' },
  },
  journal: {
    tag: 'The journal',
    heading: { text: 'Before the ink.' },
    link: { label: 'All articles', href: '/journal' },
  },
  finalCta: {
    tag: `${STUDIO_NAME} / Albania`,
    heading: { text: 'Your story.', accent: 'Let’s make it stay.' },
    button: { label: 'Send your tattoo idea', href: enquiry },
  },
  mobileCta: { label: 'Your next tattoo', href: enquiry },
  meta: {
    title: `Tattoos in Albania – Tisi, 18 Years of Experience | ${STUDIO_NAME}`,
    description: `Your story, our artistry. Discover ${STUDIO_NAME} in Fier, Albania, and Tisi’s 18 years of tattoo experience. Explore the portfolio and plan your tattoo enquiry.`,
    image: refs.og,
  },
  _status: 'published',
})

export const aboutPage = (refs: GlobalRefs): Seed<AboutPage> => ({
  hero: {
    tag: 'The artist. The studio. The story.',
    heading: { text: 'More than ink.', soft: 'A part of you.' },
    intro: 'Meet the person behind the work.\nAnd find the connection behind your next tattoo.',
    scrollLabel: 'Get to know Tisi',
    indexLabel: '01 / About us',
    background: refs.backgrounds.about,
  },
  meetArtist: {
    tag: 'Meet your artist',
    heading: { text: 'Tisi.', soft: '18 years.\nA lifetime of dedication.' },
    artist: refs.artist,
    button: { label: 'Explore the portfolio', href: '/portfolio' },
  },
  focus: {
    tag: 'The work behind the experience',
    heading: { text: 'Big ideas.', soft: 'Personal details.' },
    intro: '18 years of experience.\nA body of work to explore.\nA new story with every piece.',
    items: [
      {
        label: 'Large tattoos',
        title: 'A bigger canvas.\nA connected composition.',
        text: 'Large tattoos give an idea room to develop. Whether you’re considering an arm, leg or back piece, the conversation starts with the overall composition: the main subject, supporting details and how the design follows your body.\n\nExplore Tisi’s larger work and discuss how your idea could take shape, including the session plan and time it may need.',
        link: { label: 'Explore the work', href: '/portfolio' },
      },
      {
        label: 'Portrait tattoos',
        title: 'A familiar face.\nA lasting connection.',
        text: 'A portrait can carry a memory, a tribute or a personal connection. Expression, light and the quality of the reference photograph all become part of the conversation about the image you want to wear.\n\nBring your chosen photographs and tell Tisi what matters most about the person or subject. Discuss placement and the details you want the portrait to capture.',
        link: { label: 'Discuss your portrait idea', href: contactEnquiry },
      },
    ],
  },
  values: {
    tag: 'Your idea, at the centre',
    heading: { text: 'Make it mean something.' },
    cards: [
      {
        title: 'A story worth sharing.',
        text: 'We take time to talk through what you have in mind. Bring a story, a reference or a rough idea, or come without a starting point. Together, we can find a direction and design a tattoo for you.',
      },
      {
        title: 'A direction that feels yours.',
        text: 'Explore references, placement and style. Use the portfolio to begin the conversation about your own piece.',
      },
      {
        title: 'A clear next step.',
        text: 'Discuss the design approach, estimated cost and available dates before confirming an appointment.',
      },
    ],
  },
  studio: {
    tag: `${STUDIO_NAME} / Fier, Albania`,
    heading: { text: 'Local roots.', soft: 'Stories from\neverywhere.' },
    text: 'Whether you live in Albania or are travelling here, start by showing us what you have in mind.\n\nPlanning your trip from Italy, Germany, Switzerland or elsewhere? Include your dates in your enquiry and confirm the appointment before finalising your travel plans.',
    link: { label: 'Explore the journal', href: '/journal' },
  },
  meta: {
    title: `About Tisi | ${STUDIO_NAME}`,
    description: `Meet Tisi, the artist behind ${STUDIO_NAME} in Fier, Albania: 18 years of tattoo experience, from large compositions to portraits.`,
  },
  _status: 'published',
})

export const portfolioPage = (refs: GlobalRefs): Seed<PortfolioPage> => ({
  hero: {
    tag: 'Art. Identity. Expression.',
    heading: { text: 'The work.', soft: 'Look closer.' },
    intro: 'Find the styles, details and placements that speak to you.',
    indexLabel: '02 / Portfolio',
    background: refs.backgrounds.portfolio,
  },
  intro: {
    tag: 'Tisi / Tattoo portfolio / Albania',
    heading: { text: 'Real work. Individual stories.' },
    text: doc(
      p(
        `Explore tattoos by Tisi at ${STUDIO_NAME} in Fier, Albania. Discover realistic portraits, large sleeves, full back pieces, traditional colour tattoos and geometric designs. Each project brings together photographs, videos where available, and a closer look at its subjects and details.`,
      ),
      p(
        'Planning your own piece? Share your idea and placement through our ',
        link('contact page', '/contact'),
        '. If you are travelling from abroad, explore our ',
        link('Albania visitor guide', '/visiting-albania'),
        ' and discuss availability before arranging your trip.',
      ),
    ),
  },
  filter: { allLabel: 'All work', countLabel: 'Projects' },
  detail: {
    label: `Tisi / ${STUDIO_NAME} / Fier, Albania`,
    photoLabel: 'View original colours',
    videoCaption: 'A closer view of the details and placement.',
    storyHeading: 'Look closer.',
    storyNote: `Part of Tisi’s tattoo portfolio at ${STUDIO_NAME} in Fier, Albania. Open a photograph to see its original colours and details.`,
    direction: {
      title: 'Your own direction.',
      text: 'We take time to discuss your idea. Bring references, a story or a rough starting point. If you do not have one yet, we can explore the direction together and design something for you.',
    },
    ctaLabel: 'Discuss your tattoo',
    travel: {
      tag: 'Thinking of travelling for your piece?',
      heading: { text: 'Your tattoo.', soft: 'Your visit to Albania.' },
      text: `${STUDIO_NAME} is in Fier, Albania. Meet Tisi, an artist with 18 years of tattoo experience, and discuss your idea before planning travel around an appointment.`,
      links: [
        { label: 'Meet Tisi', href: '/about' },
        { label: 'Plan your visit', href: '/visiting-albania' },
      ],
    },
    suggestions: {
      tag: 'Keep exploring',
      heading: { text: 'More work by Tisi.' },
      button: { label: 'All portfolio', href: '/portfolio' },
      cardLink: 'View this piece',
    },
  },
  meta: {
    title: `Tisi Tattoo Portfolio in Fier, Albania | ${STUDIO_NAME}`,
    description: `Explore Tisi’s tattoo portfolio in Fier, Albania: realistic portraits, full sleeves, back pieces, colour tattoos and geometric designs at ${STUDIO_NAME}.`,
  },
  _status: 'published',
})

export const visitingPage = (refs: GlobalRefs): Seed<VisitingPage> => ({
  hero: {
    tag: 'Your tattoo. Your trip. Your Albania.',
    heading: { text: 'Come for the ink.', soft: 'Stay for the', accent: 'experience.' },
    intro: `Plan a tattoo visit to ${STUDIO_NAME} in Fier, Albania. Start with your idea, make a clear appointment plan and leave room to discover the country around you.`,
    button: { label: 'Plan your tattoo visit', href: travelEnquiry },
    note: 'Travelling from Italy, Germany, the UK, Sweden, Denmark, Belgium or elsewhere? Share your dates and tell us what help you need.',
    route: {
      title: 'A trip built around you',
      stops: [
        { label: 'Arrive', title: 'Albania.', text: 'Your arrival point. Your onward journey.' },
        { label: 'Create', title: 'Fier.', text: 'Your tattoo appointment with Tisi.' },
        {
          label: 'Explore',
          title: 'Your next chapter.',
          text: 'Culture, food and places to remember.',
        },
      ],
      footnote: 'An outline, not to scale',
    },
    background: refs.backgrounds.visiting,
  },
  plan: {
    navLabel: 'Plan your visit',
    tag: 'The tattoo comes first',
    heading: { text: 'A good trip starts\nwith a clear plan.' },
    intro: 'Your appointment is the anchor.\nBuild the rest of the visit around it.',
    cards: [
      {
        label: 'Share',
        title: 'Bring your idea.',
        text: 'Send the subject, placement and references you have in mind. Include your planned dates in Albania and whether they’re flexible.',
        link: { label: 'Explore the portfolio', href: '/portfolio' },
      },
      {
        label: 'Confirm',
        title: 'Know the details.',
        text: 'Discuss your design, estimated cost, session length and number of visits. Confirm any deposit and cancellation terms before booking.',
      },
      {
        label: 'Plan',
        title: 'Make room for your stay.',
        text: 'Once the appointment is confirmed, organise your accommodation and transport. Ask how your travel plans fit preparation and aftercare.',
      },
    ],
  },
  stay: {
    navLabel: 'Hotels & transport',
    tag: 'A little help with the practical side',
    heading: { text: 'Your tattoo.', soft: 'Your stay, made simpler.' },
    intro:
      'Need help finding a place to stay\nor getting to the studio? Tell us\nwhen you enquire.',
    cards: [
      {
        symbol: 'home',
        tag: 'Somewhere to stay',
        title: 'Ask about hotel options.',
        text: 'Share your dates, number of guests and preferred budget. Ask for help exploring accommodation options around your appointment in Fier.',
        bullets:
          'Your preferred area and length of stay\nSolo travel, a partner or a group\nAccessibility or other practical needs',
        button: { label: 'Ask about accommodation', href: travelEnquiry },
      },
      {
        symbol: 'arrow',
        tag: 'Getting here',
        title: 'Ask about transport.',
        text: 'Tell us your arrival point and where you’ll be staying. Ask for guidance on reaching Fier and whether help arranging a transfer is available.',
        bullets:
          'Arrival airport or city and arrival time\nTransport to the studio and return journey\nAny onward travel you’re planning',
        button: { label: 'Ask about your journey', href: travelEnquiry },
      },
    ],
    notice:
      'Hotel and transport help depends on availability and is confirmed with you, including any price, before anything is arranged. No hotel, transfer or travel package is booked through this website.',
    arrival: {
      title: 'Arriving through Tirana?',
      text: doc(
        p(
          'Check current transport options with ',
          link('Tirana International Airport', 'https://tirana-airport.com/transport'),
          ', then confirm your onward route to Fier. Travel times and costs depend on your starting point, traffic and provider. Ask for the exact studio address before setting off.',
        ),
      ),
    },
  },
  explore: {
    navLabel: 'Explore Albania',
    tag: 'Discover the country around your tattoo',
    heading: { text: 'Make room for', soft: 'a little Albania.' },
    intro: 'A few ideas for your itinerary.\nChoose the pace that suits your trip.',
    destinations: [
      {
        motif: 'columns',
        tag: 'History / around Fier',
        title: 'Apollonia.',
        text: 'Explore the archaeological heritage of Apollonia, near Fier. A cultural stop to consider when building time around your studio visit.',
        link: {
          label: 'Official destination guide',
          href: 'https://akt.gov.al/site-arkeologjike/apollonia/',
        },
      },
      {
        motif: 'windows',
        tag: 'Culture / city exploring',
        title: 'Berat.',
        text: 'Discover Berat’s historic neighbourhoods and distinctive hillside setting. Browse its official visitor information to plan a cultural day out.',
        link: { label: 'Official destination guide', href: 'https://akt.gov.al/en/qytetet/berat/' },
      },
      {
        motif: 'waves',
        tag: 'Coast / a change of scene',
        title: 'Vlorë.',
        text: 'Consider Vlorë for a coastal part of your trip. Discuss the timing of beach days with your artist before deciding where your tattoo fits.',
        link: { label: 'Official destination guide', href: 'https://akt.gov.al/en/cities/vlore/' },
      },
    ],
    note: 'These are itinerary ideas, not organised tours. Check opening times, access and transport directly before visiting.',
    slow: {
      tag: 'You don’t need to fill every hour',
      title: 'Leave space for food, coffee\nand a slower day.',
      text: 'A café stop, local food or an unhurried city visit can be part of the experience. Tell the artist about sightseeing, outdoor activities, swimming and onward travel, and ask for personalised preparation and aftercare guidance. Keep the itinerary flexible around your appointment.',
    },
  },
  itinerary: {
    tag: 'A flexible outline, not a fixed package',
    heading: { text: 'One appointment.', soft: 'A trip that fits you.' },
    text: 'The right length of stay depends on your tattoo and session plan. Confirm that first; this outline is only a way to organise the conversation.',
    items: [
      {
        label: 'Before you travel',
        title: 'Agree on the tattoo plan.',
        text: 'Confirm the appointment, estimated cost, terms, location and any help you’ve asked for with your stay.',
      },
      {
        label: 'Arrival & your appointment',
        title: 'Give yourself breathing room.',
        text: 'Allow time for arrival, getting to Fier and any agreed design discussion. Avoid planning a session around an uncertain connection.',
      },
      {
        label: 'The rest of your visit',
        title: 'Explore at the right pace.',
        text: 'Build sightseeing and onward travel around the artist’s advice. Ask whether your design needs another session before you leave.',
      },
    ],
  },
  questions: {
    navLabel: 'Your questions',
    tag: 'Before you make plans',
    heading: { text: 'A few questions.', soft: 'Clear next steps.' },
  },
  endCta: {
    tag: 'Let’s start with your idea',
    heading: { text: 'Your story.', accent: 'Your Albania.' },
    text: 'Tell us what you’d like tattooed, when you’re visiting\nand whether you need help with hotels or transport.',
    button: { label: 'Plan your tattoo visit', href: travelEnquiry },
    note: 'An enquiry doesn’t book an appointment, hotel or transfer.',
  },
  meta: {
    title: `Visiting Albania for a Tattoo | ${STUDIO_NAME}`,
    description: `Plan a tattoo visit to ${STUDIO_NAME} in Fier, Albania: appointment first, then hotels, transport and places to explore around your session.`,
  },
  _status: 'published',
})

export const journalPage = (refs: GlobalRefs): Seed<JournalPage> => ({
  hero: {
    tag: 'Notes from the studio',
    heading: { text: 'Before the ink.', soft: 'A little inspiration.' },
    intro: 'Ideas to explore. Questions to ask.\nA place to begin your next piece.',
    indexLabel: '03 / The journal',
    background: refs.backgrounds.journal,
  },
  featured: {
    tag: 'The first conversation',
    post: refs.featuredPost,
    label: 'Featured guide',
    buttonLabel: 'Read the guide',
  },
  list: {
    heading: 'From the journal.',
    searchLabel: 'Find a topic',
    searchPlaceholder: 'Search the journal…',
    emptyText: 'No articles match that topic. Try “planning”, “Albania” or “inspiration”.',
    readLabel: 'Read article',
  },
  article: {
    tocLabel: 'In this guide',
    backLabel: 'All articles',
    backButtonLabel: 'Back to the journal',
  },
  meta: {
    title: `Tattoo Journal | ${STUDIO_NAME}`,
    description:
      'Guides to planning your tattoo: what to bring to a consultation, travelling to Albania for a tattoo and finding your direction.',
  },
  _status: 'published',
})

export const contactPage = (): Seed<ContactPage> => ({
  hero: {
    tag: 'Tell us what you have in mind',
    heading: { text: 'One idea.\nA conversation.', accent: 'Your tattoo.' },
    intro: `Contact ${STUDIO_NAME} about a tattoo in Fier, Albania. Share your subject, preferred placement and any references. Include the dates you have in mind, whether you live nearby or are travelling from abroad.`,
    studioLabel: 'The studio',
    directLabel: 'Direct contact',
  },
  form: {
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
  next: {
    tag: 'What happens next',
    heading: { text: 'From enquiry to appointment.' },
    cards: [
      {
        title: 'Share your direction.',
        text: 'Your idea, placement and references help begin the conversation.',
      },
      {
        title: 'Discuss the details.',
        text: 'Confirm the design approach, estimated cost, available dates and any deposit terms directly with the studio.',
      },
      {
        title: 'Confirm your plans.',
        text: 'An enquiry is not a booking. Wait for a confirmed appointment before arranging travel around it.',
      },
    ],
  },
  faq: {
    tag: 'Before you get in touch',
    heading: { text: 'A few useful answers.' },
  },
  meta: {
    title: `Contact & Tattoo Enquiries | ${STUDIO_NAME}`,
    description: `Send your tattoo idea to ${STUDIO_NAME} in Fier, Albania: subject, placement, references and your dates, whether you live nearby or are travelling.`,
  },
  _status: 'published',
})

export const siteSettings = (refs: GlobalRefs): Seed<SiteSetting> => ({
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
