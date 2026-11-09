import { block, doc, h2, link, p } from './lexical'

/*
 * Starting content for London InkTattoo in Fier, adapted from the approved design, all editable in
 * the CMS. Contact details (phone, email, street, hours) are deliberately left as placeholders or
 * empty; the real ones come from the studio (docs/RESOURCES_NEEDED.md).
 */

export const STUDIO_NAME = 'London InkTattoo'

/** Portfolio categories (the `styles` collection). */
export const styles = [
  { name: 'Graphic', slug: 'graphic' },
  { name: 'Botanical', slug: 'botanical' },
  { name: 'Symbolic', slug: 'symbolic' },
  { name: 'The process', slug: 'process' },
]

export const artists = [
  {
    name: 'Tisi',
    slug: 'tisi',
    yearsOfExperience: 18,
    bio: doc(
      p(
        'Behind London InkTattoo is Tisi, an artist with 18 years of tattoo experience and an extensive body of work. From large tattoos that become part of a person’s identity to portraits that keep someone close, his work begins with the story the client wants to carry.',
      ),
      p(
        'A large piece asks you to think beyond a single image: how the composition sits on the body, how its elements connect and how the details work together. Portrait tattoos bring a different focus: the expression, character and small features that make a face familiar.',
      ),
      p(
        'For Tisi, every new project is another personal conversation. Bring the person, subject or idea you have in mind, and talk through the placement, references and direction of the piece together. You don’t need every detail figured out before you begin.',
      ),
      p(
        'Choosing an artist means trusting someone with something permanent. Take time to explore Tisi’s portfolio, look closely at the work that connects with you and imagine the possibilities for your own tattoo.',
      ),
    ),
  },
]

type PortfolioSeed = {
  title: string
  slug: string
  style: string
  placement: string
  summary: string
  detailsHeading: string
  story: { title: string; text: string }[]
}

const makeItPersonal = (text: string) => ({ title: 'Make it personal.', text })
const lookCloser = (text: string) => ({ title: 'Look closer.', text })

export const portfolio: PortfolioSeed[] = [
  {
    title: 'Graphic Back Tattoo',
    slug: 'graphic-back-tattoo',
    style: 'graphic',
    placement: 'Back',
    summary:
      'Strong contrast, layered detail and a composition that uses the back as a single canvas. A starting point for discussing a larger tattoo and the elements you want it to bring together.',
    detailsHeading: 'A statement across the back.',
    story: [
      lookCloser(
        'The broad placement creates room for a central motif and supporting patterns. Look at how areas of dark ink sit beside open skin, and how the smaller details fit within the overall shape.',
      ),
      makeItPersonal(
        'For your own back piece, bring the subject, references and meaning you have in mind. Discuss the composition and placement with Tisi, along with the session plan, estimated cost and time the work may need.',
      ),
    ],
  },
  {
    title: 'Botanical Arm Tattoo',
    slug: 'botanical-arm-tattoo',
    style: 'botanical',
    placement: 'Arm',
    summary:
      'A botanical subject gives this arm tattoo its direction. The flower forms and flowing lines show how a natural motif can become a personal piece.',
    detailsHeading: 'Nature, carried with you.',
    story: [
      lookCloser(
        'Notice the relationship between the flower, its surrounding lines and the space around the design. The placement is part of the composition, rather than a separate decision made at the end.',
      ),
      makeItPersonal(
        'Tell Tisi whether a particular flower or plant has meaning for you, or bring references for a visual direction you like. You can also begin without a reference and discuss a design together.',
      ),
    ],
  },
  {
    title: 'Symbolic Shoulder Tattoos',
    slug: 'symbolic-shoulder-tattoos',
    style: 'symbolic',
    placement: 'Shoulder',
    summary:
      'Separate symbolic motifs create a collection of details around the shoulder and upper chest: small tattoos that relate to one another while keeping their own identity.',
    detailsHeading: 'Small marks. Personal meaning.',
    story: [
      lookCloser(
        'Open space matters here. Consider the size and position of each motif, the distance between the pieces and how the arrangement sits alongside existing tattoos.',
      ),
      makeItPersonal(
        'Bring the symbols or memories you want to express, whether you are starting with one small piece or thinking about several. Discuss the overall arrangement with Tisi before settling on the individual designs.',
      ),
    ],
  },
  {
    title: 'Tattoo Process: A Close-Up',
    slug: 'tattoo-process-close-up',
    style: 'process',
    placement: 'Arm',
    summary:
      'Tattooing in progress, up close. A process study rather than a finished piece, with space to look at the detail involved in creating a tattoo.',
    detailsHeading: 'A closer look at the craft.',
    story: [
      lookCloser(
        'A process photograph tells a different story from a finished or healed image. Use it to begin asking questions about how a session is organised and how a design develops on the skin.',
      ),
      makeItPersonal(
        'Before your appointment, discuss the design review, expected session time, preparation and aftercare with Tisi. Ask to see relevant finished and healed work when choosing the direction for your own tattoo.',
      ),
    ],
  },
  {
    title: 'Inside a Tattoo Session',
    slug: 'inside-a-tattoo-session',
    style: 'process',
    placement: 'Arm',
    summary:
      'A wider view of tattooing in progress puts the working process in context, and opens the conversation about what your own appointment could involve.',
    detailsHeading: 'From a conversation to a piece.',
    story: [
      lookCloser(
        'The artist, the arm and the working space in one frame: a reminder that a tattoo is made over time, in a calm and focused session.',
      ),
      makeItPersonal(
        'Share your idea and placement first. Then discuss the design approach, timing and cost, along with anything you want to understand before confirming your appointment. If you are travelling, include your dates in Albania.',
      ),
    ],
  },
]

/** Journal categories. */
export const categories = [
  { title: 'Planning', slug: 'planning' },
  { title: 'Visiting Albania', slug: 'visiting-albania' },
  { title: 'Inspiration', slug: 'inspiration' },
]

type Page = 'home' | 'contact' | 'visiting'

export const faqs: Array<{ question: string; answer: ReturnType<typeof doc>; pages: Page[] }> = [
  {
    question: 'Where is London InkTattoo?',
    pages: ['home', 'visiting'],
    answer: doc(
      p(
        'London InkTattoo is a tattoo studio in Fier, Albania. Tisi is the artist behind the studio, with 18 years of tattoo experience. Confirm the exact address and your appointment time with the studio before visiting.',
      ),
    ),
  },
  {
    question: 'Who is the artist behind London InkTattoo?',
    pages: ['home'],
    answer: doc(
      p(
        'Tisi is the artist behind London InkTattoo, with 18 years of tattoo experience. Visit the ',
        link('About page', '/about'),
        ' to get to know the artist, and use the portfolio to begin discussing your own direction.',
      ),
    ),
  },
  {
    question: 'Can I enquire from outside Albania?',
    pages: ['home'],
    answer: doc(
      p(
        'Yes. Include the country you’re travelling from and your planned dates in Albania. Confirm availability and the appointment before arranging travel around your tattoo.',
      ),
    ),
  },
  {
    question: 'Can I send reference photos or a video?',
    pages: ['home'],
    answer: doc(
      p(
        'Yes. The enquiry form lets you add reference photos or a short video. They help explain the direction you have in mind; the design itself is drawn for you.',
      ),
    ),
  },
  {
    question: 'Can I enquire before travelling to Albania?',
    pages: ['contact'],
    answer: doc(
      p(
        'Yes. Share your idea and include your planned dates. Wait for the studio to confirm availability before finalising your travel.',
      ),
    ),
  },
  {
    question: 'Do I need to know the exact design?',
    pages: ['contact'],
    answer: doc(
      p(
        'No. A subject, a reference or a direction gives the consultation somewhere to begin. Tell the artist which details matter to you.',
      ),
    ),
  },
  {
    question: 'How much will my tattoo cost?',
    pages: ['home', 'contact'],
    answer: doc(
      p(
        'Every tattoo is quoted individually, based on the design, detail and placement. Ask for a personal estimate, and confirm what it includes, any deposit and the cancellation terms before booking.',
      ),
    ),
  },
  {
    question: 'Can you help with a hotel or transport?',
    pages: ['visiting'],
    answer: doc(
      p(
        'Tell us what help you need in your enquiry. Hotel suggestions and help arranging a transfer depend on availability and are confirmed with you, including any price, before anything is arranged. Nothing is booked through this website.',
      ),
    ),
  },
  {
    question: 'Are accommodation or transfers included in the tattoo price?',
    pages: ['visiting'],
    answer: doc(
      p(
        'No. Ask for separate written details of any hotel, transfer or other help before agreeing to it.',
      ),
    ),
  },
  {
    question: 'How many days should I stay?',
    pages: ['visiting'],
    answer: doc(
      p(
        'That depends on the design, the number of sessions and the appointment schedule. Discuss your tattoo and travel dates first; not every tattoo can be finished within a fixed stay.',
      ),
    ),
  },
  {
    question: 'Can I combine the appointment with a beach holiday?',
    pages: ['visiting'],
    answer: doc(
      p(
        'Tell the artist about your plans before confirming your dates. Ask for personal guidance about swimming, sun exposure and aftercare rather than assuming every activity fits straight after a session.',
      ),
    ),
  },
  {
    question: 'Can a friend or partner come with me?',
    pages: ['visiting'],
    answer: doc(
      p(
        'Include the number of travellers when asking about accommodation or transport. Ask the studio separately about guests during the appointment.',
      ),
    ),
  },
  {
    question: 'Is my appointment booked when I send an enquiry?',
    pages: ['contact', 'visiting'],
    answer: doc(
      p(
        'No. An enquiry starts the conversation. Your appointment is booked only once the studio confirms it, and any travel help is confirmed separately.',
      ),
    ),
  },
]

export const legalPages = [
  {
    title: 'Privacy policy',
    slug: 'privacy',
    content: doc(
      p(
        'Placeholder. The studio’s privacy policy goes here. Albanian data-protection law follows the EU’s GDPR, so it should explain what we collect through the enquiry form (name, contact details, your idea, travel dates and any reference photos or videos), why, how long we keep it, and how to ask us to delete it.',
      ),
    ),
  },
  {
    title: 'Cookie policy',
    slug: 'cookies',
    content: doc(
      p(
        'Placeholder. The studio’s cookie policy goes here: which cookies the site sets (analytics and advertising only after you accept them) and how to change your choice.',
      ),
    ),
  },
]

type PostSeed = {
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
  content: ReturnType<typeof doc>
}

export const posts: PostSeed[] = [
  {
    title: 'What to bring to your tattoo consultation.',
    slug: 'tattoo-consultation',
    excerpt: 'An idea, a few references and the details that make it yours.',
    category: 'planning',
    publishedAt: '2026-10-28T09:00:00.000Z',
    content: doc(
      h2('Start with what matters to you.'),
      p(
        'A consultation is a chance to describe the tattoo you have in mind and understand the next steps. You don’t need to arrive with a finished design. A subject, a memory or a rough direction gives the conversation somewhere to begin.',
      ),
      h2('Choose a few useful references.'),
      p(
        'Save examples that show specific things you like: line weight, shading, composition or mood. Explain which detail matters in each reference. References are a way to communicate your direction; discuss an original design rather than asking for an exact copy.',
      ),
      h2('Talk about placement and timing.'),
      p(
        'Say where you imagine the tattoo and whether you have a preferred date. If you’re travelling to Albania, share the dates you’ll be here. Ask how the design review will work.',
      ),
      h2('Leave with the practical details.'),
      p(
        'Before confirming, ask for the estimated cost, what it includes, any deposit and cancellation terms, and how many sessions might be needed. Confirm preparation and aftercare directly with your artist. Sending an enquiry is the start of a conversation, not a confirmed appointment.',
      ),
    ),
  },
  {
    title: 'Travelling for a tattoo? Start with the appointment.',
    slug: 'tattoo-travel-albania',
    excerpt: 'How to organise the conversation before you organise the trip.',
    category: 'visiting-albania',
    publishedAt: '2026-10-14T09:00:00.000Z',
    content: doc(
      h2('Confirm the tattoo plan first.'),
      p(
        'If your tattoo is an important part of your visit to Albania, begin with the studio conversation. Share your idea, placement and the dates you expect to be in the country. Ask for availability before committing to travel around an assumed appointment.',
      ),
      block('cta', {
        heading: 'Planning your stay?',
        text: 'The visitor guide covers accommodation and transport questions, places to explore and a practical planning outline.',
        button: { label: 'Read the visitor guide', href: '/visiting-albania' },
      }),
      h2('Ask about the session schedule.'),
      p(
        'A consultation and a tattoo appointment may happen at different times. Ask whether your piece may require more than one session, how long to allow and when you’ll review the design. Keep the details in writing so everyone is planning around the same dates.',
      ),
      h2('Know where you’re going.'),
      p(
        'London InkTattoo is in Fier, Albania. Confirm the exact studio address and appointment time directly before travelling. Work out your transport and allow flexibility; journey times depend on your route and conditions.',
      ),
      h2('Discuss the rest of your itinerary.'),
      p(
        'Tell the artist about planned beach days, outdoor activities and onward travel. Ask for personalised preparation and aftercare guidance when deciding where the appointment fits into your visit.',
      ),
    ),
  },
  {
    title: 'Find your direction, before your design.',
    slug: 'choosing-tattoo-style',
    excerpt: 'A closer look at subject, style and placement.',
    category: 'inspiration',
    publishedAt: '2026-09-30T09:00:00.000Z',
    content: doc(
      h2('Separate the subject from the style.'),
      p(
        'The subject is what your tattoo depicts. The style is how it is expressed. A flower, for example, can be drawn with delicate lines, strong graphic shapes or detailed shading. Looking at those choices separately can help you explain your idea.',
      ),
      h2('Notice the details you return to.'),
      p(
        'When browsing work, ask yourself what catches your eye. Is it the contrast, the amount of open space, the texture or the way the composition follows the body? Save a small selection and write a sentence about each.',
      ),
      h2('Think about the placement.'),
      p(
        'Bring your preferred placement to the conversation, while leaving room to discuss composition with the artist. Ask to see relevant examples, including healed work where available, to understand the direction more clearly.',
      ),
      h2('Let the portfolio guide the conversation.'),
      p(
        'Look for work that relates to your idea and ask about the artist’s experience with it. A good next step is a clear brief, followed by a conversation about feasibility, design and cost. ',
        link('Explore the portfolio', '/portfolio'),
        '.',
      ),
    ),
  },
]
