import type { IconName } from '@/lib/icons'

import { b, block, doc, h2, link, ol, p, quote, ul } from './lexical'

/*
 * Placeholder content: plausible copy for a Tirana studio, all editable in the CMS. Business
 * facts (phone, email, numbers, policies) are deliberately generic placeholders; the real ones
 * come from the studio (docs/RESOURCES_NEEDED.md).
 */

export const STUDIO_NAME = 'Linja Tattoo Studio'

export const styles: Array<{
  name: string
  slug: string
  icon: IconName
  featured: boolean
  shortDescription: string
  longDescription: ReturnType<typeof doc>
}> = [
  {
    name: 'Fine line',
    slug: 'fine-line',
    icon: 'fine-line',
    featured: true,
    shortDescription:
      'Delicate single-needle work: botanicals, script and small symbols with crisp, lasting lines.',
    longDescription: doc(
      p(
        'Fine line tattoos use very thin needle groupings to build detail that looks drawn with a pen. We design them with a little more spacing than they look like they need, so the lines stay clean as the skin ages.',
      ),
      p('Good first pieces: wrist and forearm florals, short script, small constellations.'),
    ),
  },
  {
    name: 'Blackwork',
    slug: 'blackwork',
    icon: 'blackwork',
    featured: true,
    shortDescription:
      'Bold, saturated black: patterns, ornamental pieces and graphic shapes that read from across a room.',
    longDescription: doc(
      p(
        'Blackwork is all about contrast. Solid fills, heavy outlines and negative space make designs that stay legible for decades, and it is one of the best options for covering older work.',
      ),
    ),
  },
  {
    name: 'Realism',
    slug: 'realism',
    icon: 'realism',
    featured: true,
    shortDescription:
      'Black and grey portraits, animals and still life, built up in soft layers from your reference photos.',
    longDescription: doc(
      p(
        'Realism takes longer than most styles, usually several sessions. We work from your photos, plan the light and contrast together, and size the piece so the detail holds up as it heals.',
      ),
    ),
  },
  {
    name: 'Traditional',
    slug: 'traditional',
    icon: 'traditional',
    featured: true,
    shortDescription:
      'Classic bold outlines and a limited palette: swallows, roses, daggers and sacred hearts that age beautifully.',
    longDescription: doc(
      p(
        'Traditional tattooing has rules for a reason: bold lines, solid colour and simple shapes look as good in twenty years as they do on day one. We draw new designs in the classic language.',
      ),
    ),
  },
  {
    name: 'Lettering',
    slug: 'lettering',
    icon: 'lettering',
    featured: false,
    shortDescription:
      'Names, dates and words in hand-drawn script or clean type, sized and spaced to stay readable.',
    longDescription: doc(
      p(
        'We draw lettering by hand for each client and check spelling with you twice: once on paper and once as a stencil on your skin.',
      ),
    ),
  },
  {
    name: 'Cover-ups',
    slug: 'cover-ups',
    icon: 'cover-up',
    featured: false,
    shortDescription:
      'A new design that hides or reworks an old tattoo. We start with an honest look at what is possible.',
    longDescription: doc(
      p(
        'Not every tattoo can be covered in one go. At the consultation we look at the old piece in daylight, talk through options, and tell you if a few laser sessions first would give a better result.',
      ),
    ),
  },
]

export const artists: Array<{
  name: string
  slug: string
  specialities: string[]
  instagram: string
  yearsOfExperience: number
  bio: ReturnType<typeof doc>
}> = [
  {
    name: 'Arta',
    slug: 'arta',
    specialities: ['fine-line', 'lettering'],
    instagram: 'https://www.instagram.com/example.arta',
    yearsOfExperience: 9,
    bio: doc(
      p(
        'Arta trained as an illustrator before she picked up a machine, and it shows in her fine line botanicals and hand-drawn script. She likes small, considered pieces and clients who bring a story rather than a screenshot.',
      ),
    ),
  },
  {
    name: 'Dren',
    slug: 'dren',
    specialities: ['blackwork', 'cover-ups'],
    instagram: 'https://www.instagram.com/example.dren',
    yearsOfExperience: 12,
    bio: doc(
      p(
        'Dren works in heavy black: ornamental patterns, graphic shapes and large-scale pieces that follow the body. He is the studio’s go-to artist for difficult cover-ups.',
      ),
    ),
  },
  {
    name: 'Elira',
    slug: 'elira',
    specialities: ['realism'],
    instagram: 'https://www.instagram.com/example.elira',
    yearsOfExperience: 7,
    bio: doc(
      p(
        'Elira specialises in black and grey realism, especially portraits and animals. She plans every piece from your reference photos and is happy to spread larger work over several sessions.',
      ),
    ),
  },
  {
    name: 'Genti',
    slug: 'genti',
    specialities: ['traditional', 'lettering'],
    instagram: 'https://www.instagram.com/example.genti',
    yearsOfExperience: 10,
    bio: doc(
      p(
        'Genti draws traditional tattoos with bold lines and a tight palette, from walk-in flash to full sleeves. He also runs the studio’s aftercare follow-ups.',
      ),
    ),
  },
]

export const portfolio: Array<{
  title: string
  artist: string
  style: string
  placement: string
  featured: boolean
}> = [
  {
    title: 'Peony on the forearm',
    artist: 'arta',
    style: 'fine-line',
    placement: 'Forearm',
    featured: true,
  },
  {
    title: 'Raven over the shoulder',
    artist: 'dren',
    style: 'blackwork',
    placement: 'Shoulder',
    featured: true,
  },
  {
    title: 'Portrait in black and grey',
    artist: 'elira',
    style: 'realism',
    placement: 'Upper arm',
    featured: true,
  },
  {
    title: 'Swallow and dagger',
    artist: 'genti',
    style: 'traditional',
    placement: 'Calf',
    featured: true,
  },
  {
    title: 'Botanical script',
    artist: 'arta',
    style: 'lettering',
    placement: 'Collarbone',
    featured: true,
  },
  {
    title: 'Ornamental back panel',
    artist: 'dren',
    style: 'blackwork',
    placement: 'Upper back',
    featured: true,
  },
  { title: 'Lion study', artist: 'elira', style: 'realism', placement: 'Thigh', featured: false },
  {
    title: 'Sacred heart',
    artist: 'genti',
    style: 'traditional',
    placement: 'Chest',
    featured: false,
  },
]

export const categories = [
  { title: 'Guides', slug: 'guides', description: 'Practical advice for planning your tattoo.' },
  {
    title: 'Aftercare',
    slug: 'aftercare',
    description: 'How to heal well and keep your tattoo looking sharp.',
  },
  { title: 'Styles', slug: 'styles', description: 'The tattoo styles we work in, explained.' },
]

export const faqs: Array<{ question: string; answer: ReturnType<typeof doc> }> = [
  {
    question: 'How much does a tattoo cost?',
    answer: doc(
      p(
        'Every piece is quoted individually, based on size, detail and placement. You get a clear price at your consultation, before anything is booked, and it doesn’t change on the day.',
      ),
    ),
  },
  {
    question: 'Does getting a tattoo hurt?',
    answer: doc(
      p(
        'A little. Most people describe it as a hot scratch that becomes easier to ignore after the first few minutes. Bony areas like ribs and ankles are more sensitive; we take breaks whenever you need one.',
      ),
    ),
  },
  {
    question: 'How do I look after a new tattoo?',
    answer: doc(
      p(
        'Keep it clean, moisturise lightly and keep it out of the sun and the sea for two weeks. You leave with written aftercare instructions, and you can message your artist any time while it heals. Read our ',
        link('aftercare guide', '/journal/tattoo-aftercare-first-two-weeks'),
        ' for the details.',
      ),
    ),
  },
  {
    question: 'How old do I need to be?',
    answer: doc(p('You need to be 18 or over, and we ask everyone to bring a valid photo ID.')),
  },
  {
    question: 'Do I need to pay a deposit?',
    answer: doc(
      p(
        'Yes. A deposit secures your appointment and comes off the final price. If you need to move your appointment, let us know at least 48 hours before and we carry the deposit over.',
      ),
    ),
  },
  {
    question: 'Can you cover up an old tattoo?',
    answer: doc(
      p(
        'Often, yes. Send us a photo with your booking request. At the consultation we tell you honestly what is possible and whether a couple of laser sessions first would help.',
      ),
    ),
  },
  {
    question: 'How long will my session take?',
    answer: doc(
      p(
        'Small pieces take one to two hours. Larger work is split into sessions of up to five hours, a few weeks apart, so your skin can heal in between.',
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
        b('Placeholder.'),
        ' The studio’s privacy policy goes here. Albanian data-protection law follows the EU’s GDPR, so it should explain what we collect through the booking form (name, contact details, your idea and any reference image), why, how long we keep it, and how to ask us to delete it.',
      ),
    ),
  },
  {
    title: 'Cookie policy',
    slug: 'cookies',
    content: doc(
      p(
        b('Placeholder.'),
        ' The studio’s cookie policy goes here: which cookies the site sets (analytics and advertising only after you accept them) and how to change your choice.',
      ),
    ),
  },
]

type PostSeed = {
  title: string
  slug: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  /** Built after artists exist, because posts embed artist cards. */
  content: (artistID: (slug: string) => number) => ReturnType<typeof doc>
}

const cta = (heading: string, text: string) =>
  block('cta', { heading, text, button: { label: 'Book a consult', href: '/#book' } })

export const posts: PostSeed[] = [
  {
    title: 'Your first tattoo: how to prepare',
    slug: 'first-tattoo-how-to-prepare',
    excerpt:
      'From the first idea to the morning of your session: what to think about, what to bring, and what to skip.',
    category: 'guides',
    author: 'arta',
    publishedAt: '2026-10-06T09:00:00.000Z',
    content: () =>
      doc(
        p(
          'A first tattoo is mostly decided before the needle ever touches skin. A little preparation makes the session calmer and the result better.',
        ),
        h2('Start with the idea, not the design'),
        p(
          'Bring the story behind the piece, a few reference images you like, and a rough idea of size and placement. Your artist turns that into an original design; you don’t need to draw anything.',
        ),
        h2('Book a consultation'),
        p('The consultation is where we agree on the details:'),
        ul(
          'Style and size',
          'Placement, checked on your body',
          'Price and number of sessions',
          'A date',
        ),
        cta(
          'Thinking about your first piece?',
          'Tell us the idea. We reply within one working day.',
        ),
        h2('The day before'),
        ul('Sleep well', 'Skip alcohol', 'Moisturise the area, but don’t shave it'),
        h2('On the day'),
        p(
          'Eat a proper meal, wear clothes that give easy access to the placement, and bring water and a snack for longer sessions.',
        ),
        quote('The best first tattoos are the ones people still choose ten years later.'),
      ),
  },
  {
    title: 'Tattoo aftercare: the first two weeks',
    slug: 'tattoo-aftercare-first-two-weeks',
    excerpt:
      'A simple day-by-day routine to help your new tattoo heal cleanly, plus the signs that mean you should call us.',
    category: 'aftercare',
    author: 'genti',
    publishedAt: '2026-10-20T09:00:00.000Z',
    content: () =>
      doc(
        p(
          'How a tattoo heals decides how it looks for years. Follow the instructions your artist gives you; this is the routine we recommend for most pieces.',
        ),
        h2('The first 24 hours'),
        ol(
          'Leave the wrap on for as long as your artist told you to',
          'Wash gently with lukewarm water and unscented soap',
          'Pat dry with a clean paper towel and let it breathe',
        ),
        h2('Days 2 to 7'),
        p(
          'Wash twice a day and apply a very thin layer of the aftercare cream we give you. Some redness and flaking is normal. ',
          b('Don’t scratch or pick.'),
        ),
        h2('Days 8 to 14'),
        p(
          'Keep moisturising. Stay out of the sun, the sea, pools and saunas until the skin has fully closed.',
        ),
        h2('When to get in touch'),
        p(
          'If redness spreads, the area gets hotter or more painful after the first few days, or anything worries you, message your artist straight away and see a doctor.',
        ),
        cta(
          'Questions while it heals?',
          'Message your artist directly. We’re here until it’s fully healed.',
        ),
      ),
  },
  {
    title: 'Fine line or blackwork? Choosing a style',
    slug: 'fine-line-or-blackwork',
    excerpt:
      'Two styles at opposite ends of the scale. How they differ, how they age, and how to tell which one suits your idea.',
    category: 'styles',
    author: 'dren',
    publishedAt: '2026-10-30T09:00:00.000Z',
    content: (artistID) =>
      doc(
        p(
          'Fine line and blackwork are two of the most requested styles in the studio, and they couldn’t be more different.',
        ),
        h2('Fine line'),
        p(
          'Thin, precise lines and small detail. Perfect for florals, script and minimal symbols. Fine line needs a little more space than it seems to, so the lines stay crisp as the skin ages.',
        ),
        block('artistCard', { artist: artistID('arta') }),
        h2('Blackwork'),
        p(
          'Bold outlines, solid fills and strong contrast. Blackwork reads from a distance, ages very well, and is often the best way to cover an older tattoo.',
        ),
        block('artistCard', { artist: artistID('dren') }),
        h2('How to choose'),
        ul(
          'Want something subtle and personal? Start with fine line.',
          'Want impact, or need to cover old work? Go for blackwork.',
          'Not sure? Bring both ideas to a consultation.',
        ),
        cta('Still deciding?', 'Bring your references and we’ll talk through both options.'),
      ),
  },
]
