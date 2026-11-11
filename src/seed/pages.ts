import type { Page } from '@/payload-types'

import { legalPages, STUDIO_NAME } from './content'
import { doc, link, p } from './lexical'

/*
 * The starting pages, built from sections exactly as the approved design lays them out. Each
 * function returns one page for `pnpm seed`; after that, everything is edited in the CMS.
 */

/** Media and documents the pages point at, created earlier in the seed. */
export type PageRefs = {
  og: number
  heroImages: [number, number]
  /** The image in the homepage's artist section, until Tisi's portrait arrives. */
  artistImage: number
  backgrounds: { about: number; portfolio: number; visiting: number; journal: number }
  homepagePieces: number[]
  homepageFilms: number[]
  artist: number
  featuredPost: number
  /** FAQ IDs by the page that lists them. */
  faqs: { home: number[]; contact: number[]; visiting: number[] }
}

export type PageSeed = Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'generateSlug'>

const enquiry = '#tattoo-enquiry'
const contactEnquiry = '/contact#tattoo-enquiry'
const travelEnquiry = '/contact?travel=1#tattoo-enquiry'

/** Plain paragraphs (blank-line separated) as rich text. */
const richParagraphs = (text: string) => doc(...text.split(/\n\s*\n/).map((part) => p(part)))

export const homePage = (refs: PageRefs): PageSeed => ({
  title: 'Homepage',
  slug: 'home',
  numberSections: true,
  layout: [
    {
      blockType: 'homeHero',
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
    {
      blockType: 'textStrip',
      phrases: [
        { text: 'Your skin. Your story.' },
        { text: '18 years of dedication.' },
        { text: 'Fier, Albania.' },
      ],
    },
    {
      blockType: 'workShowcase',
      tag: 'Explore the portfolio',
      heading: { text: 'The work.', soft: 'It speaks for itself.' },
      intro:
        'Look closer at the lines, the contrast, the details.\nFind the direction that feels like you.',
      button: { label: 'View the full portfolio', href: '/portfolio' },
      creditLine: `Original work by Tisi / ${STUDIO_NAME}, Albania`,
      trackLabel: 'Photos · scroll at your own pace',
      pieces: refs.homepagePieces,
      colourCycle: true,
      films: {
        trackLabel: 'Tattoo ideas in motion',
        itemLabel: 'Tisi / film',
        watchLabel: 'View tattoo details',
        pieces: refs.homepageFilms,
      },
      settings: { anchor: 'work', background: 'plain' },
    },
    {
      blockType: 'artist',
      tag: 'Meet your artist',
      heading: { text: 'Tisi.', soft: 'The artist behind\nyour story.' },
      artist: refs.artist,
      style: 'large',
      imageSide: 'left',
      image: refs.artistImage,
      imageNote: 'Original work by Tisi',
      text: `With 18 years of tattoo experience and an extensive body of work, Tisi creates personal tattoos at ${STUDIO_NAME} in Fier, Albania. His work spans large custom pieces, detailed portrait tattoos and full sleeves, with careful attention to composition, expression and the way a design follows the body.\n\nWe take time to discuss your idea. Bring your references, a starting point or simply a feeling you want to capture. If you are unsure where to begin, we can design something for you and work through the direction, placement and details together.`,
      button: { label: 'More about Tisi', href: '/about' },
      settings: { anchor: 'meet-the-artist', background: 'plain' },
    },
    {
      blockType: 'steps',
      style: 'compact',
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
      settings: { anchor: 'visit', background: 'grid' },
    },
    { blockType: 'divider' },
    {
      blockType: 'cards',
      style: 'numbered',
      columns: '3',
      headingSize: 'lg',
      tag: 'From idea to appointment',
      heading: { text: 'Let’s make', soft: 'a plan.' },
      intro:
        'Not every detail needs to be figured out.\nBring your starting point. Ask your questions.\nKnow what comes next.',
      cards: [
        {
          label: 'Your idea',
          graphic: 'sketch',
          title: 'Tell us what matters.',
          text: 'Describe the subject and placement. Add reference photos or a video to help explain the direction you’re drawn to.',
        },
        {
          label: 'Your quote',
          graphic: 'machine',
          title: 'Talk through the details.',
          text: 'Discuss your design, estimated cost, session plan and dates. Prices and deposit terms are confirmed directly with the studio.',
        },
        {
          label: 'Your appointment',
          graphic: 'ink',
          title: 'Confirm, then plan.',
          text: 'An enquiry starts a conversation. Your appointment is only booked after confirmation. Ask about preparation and aftercare before your visit.',
        },
      ],
      note: {
        title: 'What does a tattoo in Albania cost?',
        text: 'Design, detail and placement shape the quote. Ask for a personalised estimate and clear terms before confirming.',
        link: { label: 'Discuss your idea', href: enquiry },
      },
      settings: { anchor: 'the-plan', background: 'line' },
    },
    {
      blockType: 'enquiry',
      tag: 'Your next tattoo starts here',
      heading: { text: 'Got an idea?', accent: 'Make it yours.' },
      intro:
        'Tell us about your next tattoo. Choose your placement, add your inspiration and include any dates you have in mind.',
      side: 'text',
      detailText: 'Tattoo artist: Tisi · 18 years of experience.',
      contactLink: { label: 'Visit the contact page', href: '/contact' },
      settings: { background: 'band' },
    },
    {
      blockType: 'faq',
      tag: 'Know before you book',
      heading: { text: 'A little clarity.', soft: 'Before the ink.' },
      faqs: refs.faqs.home,
    },
    { blockType: 'divider' },
    {
      blockType: 'latestPosts',
      tag: 'The journal',
      heading: { text: 'Before the ink.' },
      link: { label: 'All articles', href: '/journal' },
      count: 3,
    },
    {
      blockType: 'pageCta',
      source: 'own',
      style: 'centred',
      tag: `${STUDIO_NAME} / Albania`,
      heading: { text: 'Your story.', accent: 'Let’s make it stay.' },
      button: { label: 'Send your tattoo idea', href: enquiry },
    },
  ],
  mobileCta: { label: 'Your next tattoo', href: enquiry },
  meta: {
    title: `Tattoos in Albania – Tisi, 18 Years of Experience | ${STUDIO_NAME}`,
    description: `Your story, our artistry. Discover ${STUDIO_NAME} in Fier, Albania, and Tisi’s 18 years of tattoo experience. Explore the portfolio and plan your tattoo enquiry.`,
    image: refs.og,
  },
  _status: 'published',
})

export const aboutPage = (refs: PageRefs): PageSeed => ({
  title: 'About',
  slug: 'about',
  layout: [
    {
      blockType: 'pageHero',
      layout: 'centred',
      height: 'tall',
      tag: 'The artist. The studio. The story.',
      heading: { text: 'More than ink.', soft: 'A part of you.' },
      intro: 'Meet the person behind the work.\nAnd find the connection behind your next tattoo.',
      jumpLink: { label: 'Get to know Tisi', href: '#artist' },
      indexLabel: '01 / About us',
      background: refs.backgrounds.about,
    },
    {
      blockType: 'artist',
      tag: 'Meet your artist',
      heading: { text: 'Tisi.', soft: '18 years.\nA lifetime of dedication.' },
      artist: refs.artist,
      style: 'standard',
      imageSide: 'left',
      button: { label: 'Explore the portfolio', href: '/portfolio' },
      settings: { anchor: 'artist', background: 'plain' },
    },
    {
      blockType: 'cards',
      style: 'panel',
      columns: '2',
      headingSize: 'sm',
      tag: 'The work behind the experience',
      heading: { text: 'Big ideas.', soft: 'Personal details.' },
      intro: '18 years of experience.\nA body of work to explore.\nA new story with every piece.',
      cards: [
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
      settings: { background: 'band' },
    },
    {
      blockType: 'cards',
      style: 'numbered',
      columns: '3',
      headingSize: 'sm',
      tag: 'Your idea, at the centre',
      heading: { text: 'Make it mean something.' },
      cards: [
        {
          graphic: 'circles',
          title: 'A story worth sharing.',
          text: 'We take time to talk through what you have in mind. Bring a story, a reference or a rough idea, or come without a starting point. Together, we can find a direction and design a tattoo for you.',
        },
        {
          graphic: 'bars',
          title: 'A direction that feels yours.',
          text: 'Explore references, placement and style. Use the portfolio to begin the conversation about your own piece.',
        },
        {
          graphic: 'asterisk',
          title: 'A clear next step.',
          text: 'Discuss the design approach, estimated cost and available dates before confirming an appointment.',
        },
      ],
    },
    {
      blockType: 'text',
      layout: 'split',
      tag: `${STUDIO_NAME} / Fier, Albania`,
      heading: { text: 'Local roots.', soft: 'Stories from\neverywhere.' },
      body: richParagraphs(
        'Whether you live in Albania or are travelling here, start by showing us what you have in mind.\n\nPlanning your trip from Italy, Germany, Switzerland or elsewhere? Include your dates in your enquiry and confirm the appointment before finalising your travel plans.',
      ),
      link: { label: 'Explore the journal', href: '/journal' },
      settings: { background: 'lines' },
    },
    { blockType: 'pageCta', source: 'shared' },
  ],
  meta: {
    title: `About Tisi | ${STUDIO_NAME}`,
    description: `Meet Tisi, the artist behind ${STUDIO_NAME} in Fier, Albania: 18 years of tattoo experience, from large compositions to portraits.`,
  },
  _status: 'published',
})

export const portfolioPage = (refs: PageRefs): PageSeed => ({
  title: 'Portfolio',
  slug: 'portfolio',
  layout: [
    {
      blockType: 'pageHero',
      layout: 'centred',
      height: 'compact',
      tag: 'Art. Identity. Expression.',
      heading: { text: 'The work.', soft: 'Look closer.' },
      intro: 'Find the styles, details and placements that speak to you.',
      indexLabel: '02 / Portfolio',
      background: refs.backgrounds.portfolio,
    },
    {
      blockType: 'portfolioGrid',
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
      allLabel: 'All work',
      countLabel: 'Projects',
    },
    { blockType: 'pageCta', source: 'shared' },
  ],
  meta: {
    title: `Tisi Tattoo Portfolio in Fier, Albania | ${STUDIO_NAME}`,
    description: `Explore Tisi’s tattoo portfolio in Fier, Albania: realistic portraits, full sleeves, back pieces, colour tattoos and geometric designs at ${STUDIO_NAME}.`,
  },
  _status: 'published',
})

export const visitingPage = (refs: PageRefs): PageSeed => ({
  title: 'Visiting Albania',
  slug: 'visiting-albania',
  numberSections: true,
  layout: [
    {
      blockType: 'pageHero',
      layout: 'split',
      tag: 'Your tattoo. Your trip. Your Albania.',
      heading: { text: 'Come for the ink.', soft: 'Stay for the', accent: 'experience.' },
      intro: `Plan a tattoo visit to ${STUDIO_NAME} in Fier, Albania. Start with your idea, make a clear appointment plan and leave room to discover the country around you.`,
      button: { label: 'Plan your tattoo visit', href: travelEnquiry },
      note: 'Travelling from Italy, Germany, the UK, Sweden, Denmark, Belgium or elsewhere? Share your dates and tell us what help you need.',
      sidePanel: {
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
      showJumpBar: true,
      background: refs.backgrounds.visiting,
    },
    {
      blockType: 'cards',
      style: 'numbered',
      columns: '3',
      headingSize: 'sm',
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
      settings: { anchor: 'plan', jumpLabel: 'Plan your visit', background: 'plain' },
    },
    {
      blockType: 'cards',
      style: 'feature',
      columns: '2',
      headingSize: 'sm',
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
          checklist:
            'Your preferred area and length of stay\nSolo travel, a partner or a group\nAccessibility or other practical needs',
          link: { label: 'Ask about accommodation', href: travelEnquiry },
        },
        {
          symbol: 'arrow',
          tag: 'Getting here',
          title: 'Ask about transport.',
          text: 'Tell us your arrival point and where you’ll be staying. Ask for guidance on reaching Fier and whether help arranging a transfer is available.',
          checklist:
            'Arrival airport or city and arrival time\nTransport to the studio and return journey\nAny onward travel you’re planning',
          link: { label: 'Ask about your journey', href: travelEnquiry },
        },
      ],
      notice:
        'Hotel and transport help depends on availability and is confirmed with you, including any price, before anything is arranged. No hotel, transfer or travel package is booked through this website.',
      closingNote: {
        title: 'Arriving through Tirana?',
        text: doc(
          p(
            'Check current transport options with ',
            link('Tirana International Airport', 'https://tirana-airport.com/transport'),
            ', then confirm your onward route to Fier. Travel times and costs depend on your starting point, traffic and provider. Ask for the exact studio address before setting off.',
          ),
        ),
      },
      settings: { anchor: 'stay', jumpLabel: 'Hotels & transport', background: 'band' },
    },
    {
      blockType: 'cards',
      style: 'place',
      columns: '3',
      headingSize: 'sm',
      tag: 'Discover the country around your tattoo',
      heading: { text: 'Make room for', soft: 'a little Albania.' },
      intro: 'A few ideas for your itinerary.\nChoose the pace that suits your trip.',
      cards: [
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
          link: {
            label: 'Official destination guide',
            href: 'https://akt.gov.al/en/qytetet/berat/',
          },
        },
        {
          motif: 'waves',
          tag: 'Coast / a change of scene',
          title: 'Vlorë.',
          text: 'Consider Vlorë for a coastal part of your trip. Discuss the timing of beach days with your artist before deciding where your tattoo fits.',
          link: {
            label: 'Official destination guide',
            href: 'https://akt.gov.al/en/cities/vlore/',
          },
        },
      ],
      smallPrint:
        'These are itinerary ideas, not organised tours. Check opening times, access and transport directly before visiting.',
      closingNote: {
        tag: 'You don’t need to fill every hour',
        title: 'Leave space for food, coffee\nand a slower day.',
        text: richParagraphs(
          'A café stop, local food or an unhurried city visit can be part of the experience. Tell the artist about sightseeing, outdoor activities, swimming and onward travel, and ask for personalised preparation and aftercare guidance. Keep the itinerary flexible around your appointment.',
        ),
      },
      settings: { anchor: 'explore', jumpLabel: 'Explore Albania', background: 'plain' },
    },
    {
      blockType: 'steps',
      style: 'timeline',
      tag: 'A flexible outline, not a fixed package',
      heading: { text: 'One appointment.', soft: 'A trip that fits you.' },
      text: 'The right length of stay depends on your tattoo and session plan. Confirm that first; this outline is only a way to organise the conversation.',
      steps: [
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
      settings: { background: 'grid' },
    },
    {
      blockType: 'faq',
      tag: 'Before you make plans',
      heading: { text: 'A few questions.', soft: 'Clear next steps.' },
      faqs: refs.faqs.visiting,
      settings: { anchor: 'questions', jumpLabel: 'Your questions', background: 'line' },
    },
    {
      blockType: 'pageCta',
      source: 'own',
      style: 'centred',
      tag: 'Let’s start with your idea',
      heading: { text: 'Your story.', accent: 'Your Albania.' },
      text: 'Tell us what you’d like tattooed, when you’re visiting\nand whether you need help with hotels or transport.',
      button: { label: 'Plan your tattoo visit', href: travelEnquiry },
      note: 'An enquiry doesn’t book an appointment, hotel or transfer.',
    },
  ],
  meta: {
    title: `Visiting Albania for a Tattoo | ${STUDIO_NAME}`,
    description: `Plan a tattoo visit to ${STUDIO_NAME} in Fier, Albania: appointment first, then hotels, transport and places to explore around your session.`,
  },
  _status: 'published',
})

export const journalPage = (refs: PageRefs): PageSeed => ({
  title: 'Journal',
  slug: 'journal',
  layout: [
    {
      blockType: 'pageHero',
      layout: 'centred',
      height: 'compact',
      tag: 'Notes from the studio',
      heading: { text: 'Before the ink.', soft: 'A little inspiration.' },
      intro: 'Ideas to explore. Questions to ask.\nA place to begin your next piece.',
      indexLabel: '03 / The journal',
      background: refs.backgrounds.journal,
    },
    {
      blockType: 'journalList',
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
    },
    { blockType: 'pageCta', source: 'shared' },
  ],
  meta: {
    title: `Tattoo Journal | ${STUDIO_NAME}`,
    description:
      'Guides to planning your tattoo: what to bring to a consultation, travelling to Albania for a tattoo and finding your direction.',
  },
  _status: 'published',
})

export const contactPage = (refs: PageRefs): PageSeed => ({
  title: 'Contact',
  slug: 'contact',
  layout: [
    {
      blockType: 'enquiry',
      tag: 'Tell us what you have in mind',
      heading: { text: 'One idea.\nA conversation.', accent: 'Your tattoo.' },
      intro: `Contact ${STUDIO_NAME} about a tattoo in Fier, Albania. Share your subject, preferred placement and any references. Include the dates you have in mind, whether you live nearby or are travelling from abroad.`,
      side: 'details',
      studioLabel: 'The studio',
      directLabel: 'Direct contact',
    },
    {
      blockType: 'cards',
      style: 'numbered',
      columns: '3',
      headingSize: 'md',
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
      settings: { background: 'line' },
    },
    {
      blockType: 'faq',
      tag: 'Before you get in touch',
      heading: { text: 'A few useful answers.' },
      faqs: refs.faqs.contact,
    },
  ],
  meta: {
    title: `Contact & Tattoo Enquiries | ${STUDIO_NAME}`,
    description: `Send your tattoo idea to ${STUDIO_NAME} in Fier, Albania: subject, placement, references and your dates, whether you live nearby or are travelling.`,
  },
  _status: 'published',
})

/** Privacy and cookies: one document-style text section each. */
export const legalPageSeeds = (): PageSeed[] =>
  legalPages.map((page) => ({
    title: page.title,
    slug: page.slug,
    layout: [
      {
        blockType: 'text',
        layout: 'document',
        heading: { text: page.title },
        body: page.content,
        showUpdated: true,
      },
    ],
    _status: 'published',
  }))
