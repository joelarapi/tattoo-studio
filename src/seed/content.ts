import { block, doc, h2, link, p } from './lexical'

/*
 * Starting content for LondonInk Tattoo in Fier, adapted from the approved design, all editable in
 * the CMS. Contact details (phone, email, street, hours) are deliberately left as placeholders or
 * empty; the real ones come from the studio (docs/RESOURCES_NEEDED.md).
 */

export const STUDIO_NAME = 'LondonInk Tattoo'

/** Portfolio categories (the `styles` collection). */
export const styles = [
  { name: 'Portrait', slug: 'portrait' },
  { name: 'Black & Grey', slug: 'black-grey' },
  { name: 'Colour', slug: 'colour' },
  { name: 'Geometric', slug: 'geometric' },
]

export const artists = [
  {
    name: 'Tisi',
    slug: 'tisi',
    yearsOfExperience: 18,
    bio: doc(
      p(
        'Behind LondonInk Tattoo is Tisi, an artist with 18 years of tattoo experience and an extensive body of work. From large tattoos that become part of a person’s identity to portraits that keep someone close, his work begins with the story the client wants to carry.',
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
  /** A portfolio category slug. */
  style: string
  placement: string
  summary: string
  /** How many photos the studio supplied: `<slug>-01.jpg`, `<slug>-02.jpg` … */
  photos: number
  /** Whether there's a film: `<slug>-video-01.mp4`, with `<slug>-video-01-poster.jpg`. */
  video?: boolean
}

/**
 * The studio's portfolio, as supplied for the design review (November 2026), in portfolio order.
 * The files themselves are fetched by the seed (studio-media.ts).
 */
export const portfolio: PortfolioSeed[] = [
  {
    title: 'Joker & Playing Cards Sleeve',
    slug: 'joker-playing-cards-sleeve',
    style: 'portrait',
    placement: 'Arm',
    photos: 1,
    video: true,
    summary:
      'A Joker portrait, playing cards and a clock come together in a black and grey sleeve, with strong shadows and crisp highlights.',
  },
  {
    title: 'Traditional Rose & Moth Tattoo',
    slug: 'traditional-rose-moth-tattoo',
    style: 'colour',
    placement: 'Arm',
    photos: 1,
    summary:
      'A red rose and moth combine bold black outlines with green leaves and warm orange details in this traditional colour tattoo.',
  },
  {
    title: 'Woman Portrait Forearm Tattoo',
    slug: 'woman-portrait-forearm-tattoo',
    style: 'portrait',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A realistic woman’s portrait on the forearm, with carefully shaded eyes, hair and lips rendered in black and grey.',
  },
  {
    title: 'Lighthouse, Anchor & Compass Tattoo',
    slug: 'lighthouse-anchor-compass-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A nautical forearm composition brings together a lighthouse, sailing boats, waves, an anchor and compass in black and grey.',
  },
  {
    title: 'Aztec-Inspired Chest & Shoulder Tattoo',
    slug: 'aztec-inspired-chest-shoulder-tattoo',
    style: 'black-grey',
    placement: 'Chest and shoulder',
    photos: 1,
    summary:
      'An expansive chest and shoulder tattoo combines a calendar-like circular motif, a fierce carved face and geometric ornament in shaded black ink.',
  },
  {
    title: 'Dragon Lower Leg Tattoo',
    slug: 'dragon-lower-leg-tattoo',
    style: 'black-grey',
    placement: 'Lower leg',
    photos: 1,
    summary:
      'A detailed dragon follows the lower leg, combining scales, flowing whiskers and layered black and grey shading.',
  },
  {
    title: 'Mandala & Mask Leg Tattoo',
    slug: 'mandala-mask-leg-tattoo',
    style: 'geometric',
    placement: 'Lower leg',
    photos: 2,
    summary:
      'Layered mandalas wrap around the leg alongside a bold mask motif. Solid black shapes, open skin and dot shading give the ornamental design its contrast.',
  },
  {
    title: 'Skull & Clock Forearm Tattoo',
    slug: 'skull-clock-forearm-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    video: true,
    summary:
      'A large skull and clock face anchor this forearm tattoo, with smooth grey shading and dark lettering extending the composition.',
  },
  {
    title: 'Angel & Money Forearm Tattoo',
    slug: 'angel-money-colour-forearm-tattoo',
    style: 'colour',
    placement: 'Forearm',
    photos: 2,
    summary:
      'A winged angel, banknotes and a globe form a forearm composition with black and grey figures against red and orange accents.',
  },
  {
    title: 'Clown Faces Forearm Tattoo',
    slug: 'clown-faces-forearm-tattoo',
    style: 'portrait',
    placement: 'Forearm',
    photos: 2,
    video: true,
    summary:
      'Expressive clown faces, dark eye makeup and small red accents create a dramatic forearm tattoo with contrasting light and shadow.',
  },
  {
    title: 'Eagle & Spartan Shoulder Tattoo',
    slug: 'eagle-spartan-chest-shoulder-tattoo',
    style: 'black-grey',
    placement: 'Chest and shoulder',
    photos: 1,
    summary:
      'An eagle spreads its wings across the chest beside a shaded Spartan helmet on the shoulder, connected by a soft cloud-like background.',
  },
  {
    title: 'Japanese-Inspired Landscape Leg Tattoo',
    slug: 'japanese-landscape-leg-tattoo',
    style: 'geometric',
    placement: 'Lower leg',
    photos: 1,
    summary:
      'A Japanese-inspired landscape combines a mountain, flying birds, a pine tree, a torii gate and a small boat, framed by geometric lines and red sun accents.',
  },
  {
    title: 'Family Beach Sunset Tattoo',
    slug: 'family-beach-sunset-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A family walks hand in hand towards the sea beneath palm trees and birds. Soft shading builds the sunset scene around the silhouettes.',
  },
  {
    title: 'Archangel & Mary Full Sleeve Tattoo',
    slug: 'archangel-mary-full-sleeve-tattoo',
    style: 'portrait',
    placement: 'Arm',
    photos: 1,
    video: true,
    summary:
      'A large religious sleeve pairs an armoured winged figure with a praying woman’s portrait, flowing fabric and architectural details in black and grey.',
  },
  {
    title: 'Black & Grey Rose Forearm Tattoo',
    slug: 'black-grey-rose-forearm-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A large rose fills the forearm with layered petals, deep black backgrounds and fine highlights that separate the flower’s shapes.',
  },
  {
    title: 'Mary, Cherub & Lettering Tattoo',
    slug: 'mary-cherub-lettering-tattoo',
    style: 'portrait',
    placement: 'Lower leg',
    photos: 1,
    summary:
      'A veiled praying figure sits above bold numerals and a cherub in this black and grey lower-leg tattoo. Radiating lines frame the portrait.',
  },
  {
    title: 'Compass, Map & Quill Tattoo',
    slug: 'compass-map-quill-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    video: true,
    summary:
      'A compass, map, key, ink bottle and quill bring a travel and writing theme together across the forearm in black and grey.',
  },
  {
    title: 'Lion & Cub Family Sleeve Tattoo',
    slug: 'lion-cub-family-sleeve-tattoo',
    style: 'portrait',
    placement: 'Arm',
    photos: 1,
    video: true,
    summary:
      'A realistic lion and cub lead this family-themed sleeve, with detailed fur, soft backgrounds and personal lettering continuing down the arm.',
  },
  {
    title: 'Colosseum & Sword Forearm Tattoo',
    slug: 'colosseum-sword-forearm-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    summary:
      'The Colosseum, a sword and cloud shading form a black and grey forearm composition, with lettering and coordinates above the architectural scene.',
  },
  {
    title: 'Grim Reaper Full Back Tattoo',
    slug: 'grim-reaper-full-back-tattoo',
    style: 'colour',
    placement: 'Back',
    photos: 1,
    summary:
      'A hooded skeleton, raven and lantern fill a large back composition. Vivid orange and red backgrounds frame the detailed black and grey figures.',
  },
  {
    title: 'Shark Forearm Tattoo',
    slug: 'shark-forearm-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A shark rises through a shaded underwater scene on the forearm, with attention to the open mouth, teeth and the shape of the body.',
  },
  {
    title: 'Lion & Compass Forearm Tattoo',
    slug: 'lion-compass-forearm-tattoo',
    style: 'portrait',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A realistic lion in profile is paired with a large compass rose, using flowing mane details and bold directional points across the forearm.',
  },
  {
    title: 'Clock, Compass & Map Tattoo',
    slug: 'clock-compass-map-tattoo',
    style: 'black-grey',
    placement: 'Forearm',
    photos: 1,
    video: true,
    summary:
      'A Roman-numeral clock, compass rose and map details create a connected forearm tattoo, with precise linework beside smooth black and grey shading.',
  },
  {
    title: 'Angel & Ornamental Arm Tattoo',
    slug: 'angel-ornamental-arm-tattoo',
    style: 'black-grey',
    placement: 'Arm',
    photos: 1,
    summary:
      'A winged figure sits within an ornamental arm composition, with feather detail, flowing shapes and broad areas of soft grey shading.',
  },
  {
    title: 'Family Memory Full Sleeve Tattoo',
    slug: 'family-memory-full-sleeve-tattoo',
    style: 'black-grey',
    placement: 'Arm',
    photos: 1,
    video: true,
    summary:
      'A family scene leads into a larger sleeve with personal dates and a warrior helmet. Black and grey shading connects the narrative elements along the arm.',
  },
  {
    title: 'Medusa & Snake Forearm Tattoo',
    slug: 'medusa-snake-forearm-tattoo',
    style: 'portrait',
    placement: 'Forearm',
    photos: 1,
    summary:
      'A woman’s face is framed by snakes in this Medusa-inspired forearm tattoo, combining detailed scales with shaded portrait features.',
  },
  {
    title: 'Jesus Portrait & Cross Tattoo',
    slug: 'jesus-portrait-cross-tattoo',
    style: 'portrait',
    placement: 'Forearm',
    photos: 1,
    video: true,
    summary:
      'A realistic portrait of Jesus with a crown of thorns is paired with a crucifix, using fine facial details and deep black and grey contrast.',
  },
  {
    title: 'Winged Warrior Arm Tattoo',
    slug: 'winged-warrior-arm-tattoo',
    style: 'black-grey',
    placement: 'Arm',
    photos: 1,
    summary:
      'An armoured winged warrior forms the centre of this arm tattoo, with layered feathers, fabric and decorative armour rendered in black and grey.',
  },
  {
    title: 'Archangel Chest Tattoo',
    slug: 'archangel-chest-tattoo',
    style: 'black-grey',
    placement: 'Chest',
    photos: 1,
    video: true,
    summary:
      'A winged armoured figure spans the chest, with shaded feathers, flowing fabric and detailed armour shaping a large black and grey tattoo.',
  },
  {
    title: 'Peaky Blinders Upper Arm Tattoo',
    slug: 'peaky-blinders-upper-arm-tattoo',
    style: 'portrait',
    placement: 'Upper arm',
    photos: 0,
    video: true,
    summary:
      'A flat-capped figure and street scene form a Peaky Blinders-inspired upper-arm tattoo, framed by script and black and grey shading.',
  },
]

/** The homepage photo track, in order. */
export const homepagePieces = [
  'jesus-portrait-cross-tattoo',
  'family-memory-full-sleeve-tattoo',
  'aztec-inspired-chest-shoulder-tattoo',
  'japanese-landscape-leg-tattoo',
  'archangel-mary-full-sleeve-tattoo',
  'woman-portrait-forearm-tattoo',
  'lion-cub-family-sleeve-tattoo',
  'joker-playing-cards-sleeve',
  'compass-map-quill-tattoo',
]

/** The homepage film track, in order (pieces with a video). */
export const homepageFilms = [
  'joker-playing-cards-sleeve',
  'skull-clock-forearm-tattoo',
  'clown-faces-forearm-tattoo',
  'archangel-mary-full-sleeve-tattoo',
  'compass-map-quill-tattoo',
  'lion-cub-family-sleeve-tattoo',
  'clock-compass-map-tattoo',
  'family-memory-full-sleeve-tattoo',
  'jesus-portrait-cross-tattoo',
  'archangel-chest-tattoo',
  'peaky-blinders-upper-arm-tattoo',
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
    question: 'Where is LondonInk Tattoo?',
    pages: ['home', 'visiting'],
    answer: doc(
      p(
        'LondonInk Tattoo is a tattoo studio in Fier, Albania. Tisi is the artist behind the studio, with 18 years of tattoo experience. Confirm the exact address and your appointment time with the studio before visiting.',
      ),
    ),
  },
  {
    question: 'Who is the artist behind LondonInk Tattoo?',
    pages: ['home'],
    answer: doc(
      p(
        'Tisi is the artist behind LondonInk Tattoo, with 18 years of tattoo experience. Visit the ',
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
        'LondonInk Tattoo is in Fier, Albania. Confirm the exact studio address and appointment time directly before travelling. Work out your transport and allow flexibility; journey times depend on your route and conditions.',
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
