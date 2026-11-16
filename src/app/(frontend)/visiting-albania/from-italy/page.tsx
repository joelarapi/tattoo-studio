import Link from 'next/link'

import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { RichText } from '@/components/RichText'
import { PortfolioCard } from '@/components/cards/PortfolioCard'
import { Action } from '@/components/ui/Action'
import { CmsImage } from '@/components/ui/CmsImage'
import { EndCta, NumberedCards, SectionHead } from '@/components/ui/Blocks'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { getLatestPosts, getPortfolioItems, getSiteSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/metadata'
import { pathForDoc } from '@/lib/routes'

const path = '/visiting-albania/from-italy'
const travelEnquiry = '/contact?travel=1#tattoo-enquiry'

const featuredSlugs = [
  'archangel-mary-full-sleeve-tattoo',
  'grim-reaper-full-back-tattoo',
  'archangel-chest-tattoo',
  'family-memory-full-sleeve-tattoo',
  'jesus-portrait-cross-tattoo',
  'mary-cherub-lettering-tattoo',
  'angel-ornamental-arm-tattoo',
  'lion-cub-family-sleeve-tattoo',
]

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return pageMetadata({
    settings,
    path,
    fallbackTitle: 'Tattoo trip from Italy to Albania',
    fallbackDescription: `Plan a tattoo visit from Italy to ${settings.studioName} in Albania. Explore real portfolio work, travel options, appointment planning and aftercare.`,
  })
}

export default async function FromItalyPage() {
  const [settings, allPieces, posts] = await Promise.all([
    getSiteSettings(),
    getPortfolioItems(),
    getLatestPosts(3),
  ])
  const pieces = [
    ...featuredSlugs.flatMap((slug) => allPieces.filter((piece) => piece.slug === slug)),
    ...allPieces.filter((piece) => !featuredSlugs.includes(piece.slug ?? '')),
  ].slice(0, 8)
  const heroPiece =
    allPieces.find((piece) => piece.slug === 'jesus-portrait-cross-tattoo') ?? pieces[0]
  const heroImage = heroPiece?.images?.[0] ?? heroPiece?.videoPoster
  const location =
    [settings.address?.city, settings.address?.country].filter(Boolean).join(', ') || 'Albania'
  const form = settings.enquiryForm

  return (
    <main id="main">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-panel px-site py-[85px] md:min-h-[680px] md:py-[110px]">
        {heroImage && (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <CmsImage
              media={heroImage}
              alt=""
              photo={false}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/95 to-bg/50" />
            <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/35" />
          </div>
        )}
        <nav
          aria-label="Breadcrumb"
          className="font-label text-[12px] tracking-[0.12em] text-text uppercase"
        >
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span aria-hidden="true" className="mx-3 text-faint">
            /
          </span>
          <Link href="/visiting-albania" className="hover:text-accent">
            Visiting Albania
          </Link>
          <span aria-hidden="true" className="mx-3 text-faint">
            /
          </span>
          <span aria-current="page">From Italy</span>
        </nav>
        <div className="mt-[75px] max-w-[900px] md:mt-[105px]">
          <Tag>Tattoo travel / Italy to Albania</Tag>
          <StyledHeading
            as="h1"
            value={{ text: 'Tattoo trip from Italy', accent: 'to Albania.' }}
            className="text-display"
          />
          <p className="mt-7 max-w-[660px] text-[17px] leading-[1.8] text-text">
            Explore the work, agree on your tattoo plan, then choose the journey that suits your
            dates. Your appointment at {settings.studioName} in {location} is the starting point.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Action href={travelEnquiry}>Plan my tattoo trip</Action>
            <Action href="#portfolio" variant="outline" arrow="down">
              See the work
            </Action>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-between gap-x-5 gap-y-2 border-y border-line bg-band px-site py-5 font-label text-[12px] tracking-[0.12em] text-text uppercase">
        <span>Your skin. Your story.</span>
        <span>One sea between us.</span>
        <span>{location}.</span>
      </div>

      <section className="px-site py-section">
        <SectionHead
          number={1}
          layout="stackedUntilWide"
          tag="Why travel from Italy"
          heading={{ text: 'Close enough for a trip.', soft: 'Planned around your tattoo.' }}
          intro="Start the design conversation before you travel, then leave enough time for the journey, your session and the trip home."
        />
        <NumberedCards
          columns={2}
          cards={[
            {
              title: 'Choose your route.',
              text: 'Compare flights into Tirana with ferries to Durrës. Check the full journey from your home in Italy to the studio before choosing a fare.',
            },
            {
              title: 'Explore the real work.',
              text: 'Look closely at portraits, sleeves and larger compositions in the studio portfolio. Use the pieces you like to explain the direction of your own tattoo.',
            },
            {
              title: 'Discuss the design first.',
              text: 'Share your subject, placement, size and reference images. Ask how the design review works and how many sessions your piece may need.',
            },
            {
              title: 'Leave room for Albania.',
              text: 'Give yourself time to reach the studio and to travel home comfortably. Plan sightseeing before your session when sun, sea or swimming are part of the trip.',
            },
          ]}
        />
      </section>

      <section id="portfolio" className="px-site py-section">
        <SectionHead
          number={2}
          layout="stackedUntilWide"
          tag="Explore the portfolio"
          heading={{ text: 'The work.', soft: 'Worth the journey.' }}
          intro="Explore large compositions alongside angel and religious tattoos from the studio. Open a piece to see more detail and discuss your own direction."
          action={
            <Action href="/portfolio" variant="outline">
              View the full portfolio
            </Action>
          }
        />
        {pieces.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
            data-reveal-group
          >
            {pieces.map((piece, index) => (
              <PortfolioCard
                key={piece.id}
                item={piece}
                position={index + 1}
                imageClassName="h-[410px] md:h-[350px] lg:h-[330px]"
              />
            ))}
          </div>
        ) : (
          <Action href="/portfolio" variant="plain">
            Explore the portfolio
          </Action>
        )}
      </section>

      <section className="bg-band px-site py-section">
        <SectionHead
          number={3}
          layout="stackedUntilWide"
          tag="Getting here from Italy"
          heading={{ text: 'By air or by sea.', soft: 'Continue on to the studio.' }}
          intro="Schedules and connections change. Check the operator for your dates before you book around an appointment."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-md border border-line bg-panel p-7 md:p-9">
            <Tag>Flying to Tirana</Tag>
            <h3 className="text-h3">A flight, then a journey to Fier.</h3>
            <p className="mt-4">
              Compare departures from airports convenient to you. Tirana International Airport
              publishes flight and ground transport information, including a bus option for Fier.
              Check departure times and pickup points directly before making plans.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Action href="https://www.tirana-airport.com/en/flights" variant="plain">
                Airport flights
              </Action>
              <Action
                href="https://www.tirana-airport.com/en/transport-and-directions/15"
                variant="plain"
              >
                Airport buses
              </Action>
            </div>
          </article>
          <article className="rounded-md border border-line bg-panel p-7 md:p-9">
            <Tag>Taking the ferry</Tag>
            <h3 className="text-h3">Cross the Adriatic to Durrës.</h3>
            <p className="mt-4">
              Ferry operators list crossings from Bari and Ancona to Durrës. Allow for boarding,
              arrival formalities and the onward trip to Fier. Check the sailing calendar and
              arrival time for your exact dates.
            </p>
            <div className="mt-7">
              <Action href="https://www.adriaferries.com/en/lines.html" variant="plain">
                Check ferry routes
              </Action>
            </div>
          </article>
        </div>
        <p className="mt-5 max-w-[800px] text-[14px] text-faint">
          Ask for the exact studio address when your appointment is confirmed. Travel times and
          available connections depend on the date and operator.
        </p>
      </section>

      <section className="px-site py-section">
        <SectionHead
          number={4}
          tag="From Italy to the chair"
          heading={{ text: 'Let’s make a plan.', soft: 'Then make the trip.' }}
        />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [
              'Send your idea and dates',
              'Tell us the subject, placement and size you have in mind. Include references and the dates you could travel.',
            ],
            [
              'Talk through the design',
              'Discuss the approach, estimated cost, session length and whether a larger piece needs more than one visit.',
            ],
            [
              'Confirm, then book travel',
              'An enquiry starts a conversation. Book flights, ferries and a place to stay after your appointment is confirmed.',
            ],
            [
              'Get tattooed, heal at home',
              'Follow the aftercare advice for your piece and allow space in the return journey for a fresh tattoo.',
            ],
          ].map(([title, text], index) => (
            <li key={title} className="border-t border-line-strong pt-5">
              <span className="font-label text-[28px] text-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-h3">{title}</h3>
              <p className="mt-3">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-band px-site py-section">
        <SectionHead
          number={5}
          layout="stackedUntilWide"
          tag="Make Albania part of your story"
          heading={{ text: 'A trip to remember.', soft: 'A piece to take home.' }}
          intro="These are examples to discuss with the studio, not fixed packages or promises about what can be completed in one stay."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              'A short stay',
              'One focused appointment, if the design and session plan allow it. Keep the arrival and departure days clear of tight connections.',
            ],
            [
              'A longer visit',
              'More time for design discussion, a session and a slower day in Albania. Confirm any additional sitting before arranging travel.',
            ],
            [
              'A large project',
              'A sleeve or back piece may need several sessions and possibly another visit. Plan the work with the artist before committing to dates.',
            ],
          ].map(([title, text]) => (
            <article key={title} className="rounded-md border border-line bg-panel p-7">
              <h3 className="text-h3">{title}</h3>
              <p className="mt-4">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-[850px]">
          If you want to visit the coast, Apollonia or Berat, put sightseeing before your tattoo
          where possible. Discuss swimming and sun exposure with your artist.
        </p>
      </section>

      <section className="grid gap-10 px-site py-section md:grid-cols-2 md:gap-[8%]">
        <div>
          <Tag number={6}>Travelling home with fresh ink</Tag>
          <StyledHeading
            value={{ text: 'Heal well', soft: 'on the way back.' }}
            className="text-h2"
          />
          <p className="mt-6 max-w-[560px]">
            Healing continues after you return to Italy. Ask for aftercare guidance specific to your
            tattoo and plan the journey back with that advice in mind.
          </p>
        </div>
        <ul className="border-t border-line-strong">
          {[
            'Leave breathing room between your last session and the trip home when you can.',
            'Wear loose clothing that will not rub against the tattoo.',
            'Keep your aftercare instructions handy, and check airline liquid rules if you are flying.',
            'Avoid swimming and direct sun on a fresh tattoo; ask when your own piece is ready for those activities.',
          ].map((item) => (
            <li key={item} className="flex gap-4 border-b border-line-strong py-5">
              <span aria-hidden="true" className="text-accent">
                ✳
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="italy-enquiry"
        className="grid gap-10 bg-band px-site py-section md:grid-cols-[1fr_1.35fr] md:gap-[8%]"
      >
        <div>
          <Tag number={7}>Enquiry from Italy</Tag>
          <StyledHeading
            value={{ text: 'Got an idea?', accent: 'Make it yours.' }}
            className="text-h2"
          />
          <p className="mt-6">
            Tell us what you want, where it goes and when you could travel. Add reference photos if
            they help explain your direction.
          </p>
          <p className="mt-6 border-t border-line pt-6">
            Need advice on reaching {location} or finding a place to stay? Ask what help is
            available. Any accommodation or transfer details must be confirmed separately.
          </p>
          <Action href={travelEnquiry} variant="plain" className="mt-7">
            Go to the contact page
          </Action>
        </div>
        <EnquiryForm
          copy={form}
          projects={allPieces.map(({ slug, title }) => ({ slug, title }))}
          privacyNote={form.privacyNote ? <RichText data={form.privacyNote} /> : undefined}
        />
      </section>

      <section className="grid gap-10 px-site py-section md:grid-cols-[0.8fr_1.2fr] md:gap-[10%]">
        <div>
          <Tag number={8}>FAQ for visitors from Italy</Tag>
          <StyledHeading value={{ text: 'Know before', soft: 'you travel.' }} className="text-h2" />
        </div>
        <div>
          {[
            {
              q: 'Do I need a passport to travel from Italy to Albania?',
              a: (
                <>
                  Italian citizens can generally enter with a valid passport or national identity
                  card. Rules depend on your nationality and circumstances, so check the{' '}
                  <a
                    href="https://ambasadat.gov.al/milan/it/keshilla-udhetimi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline"
                  >
                    Albanian consulate’s current advice
                  </a>{' '}
                  before booking.
                </>
              ),
            },
            {
              q: 'Is it better to fly or take the ferry?',
              a: (
                <>
                  Compare the full journey to the studio, including departure point, arrival time
                  and onward transport.{' '}
                  <a
                    href="https://www.tirana-airport.com/en/flights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline"
                  >
                    Airport flights
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://www.adriaferries.com/en/lines.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline"
                  >
                    ferry routes
                  </a>{' '}
                  are good places to start.
                </>
              ),
            },
            {
              q: 'How many days should I plan for?',
              a: 'That depends on your design, the number of sessions and your travel connections. Discuss the tattoo with the studio first, then choose dates with enough time on either side.',
            },
            {
              q: 'Can we communicate in Italian?',
              a: 'Tell us your preferred language when you enquire. We will confirm how we can discuss the design clearly before you travel.',
            },
            {
              q: 'How much will my tattoo cost?',
              a: 'Every piece is quoted individually. Share the design, placement, approximate size and reference images, then confirm the estimate and any deposit or cancellation terms before booking.',
            },
            {
              q: 'Can you help with hotels or transfers?',
              a: 'Ask when you enquire. The studio can confirm what guidance or help is available for your dates, including any separate cost, before anything is arranged.',
            },
            {
              q: 'Can I go to the beach after my session?',
              a: 'Plan swimming and strong sun before the tattoo where possible. A fresh tattoo needs time to heal; ask your artist for advice based on your piece.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border-b border-line-strong">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-text">
                {q}
                <span aria-hidden="true" className="text-accent group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden text-accent group-open:inline">
                  −
                </span>
              </summary>
              <p className="max-w-[720px] pb-5">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="px-site py-section">
          <SectionHead
            number={9}
            tag="The journal"
            heading={{ text: 'Before the ink.' }}
            action={
              <Action href="/journal" variant="outline">
                All articles
              </Action>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={pathForDoc('posts', post.slug)}
                className="flex min-h-[220px] flex-col justify-end rounded-md border border-line bg-panel p-7 transition-colors hover:border-accent"
              >
                <h3 className="text-h3">{post.title}</h3>
                <span className="mt-5 font-label text-[12px] text-accent uppercase">
                  Read article ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <EndCta
        cta={{
          tag: 'Your tattoo trip starts with an idea',
          heading: { text: 'Your story.', accent: 'Let’s make it stay.' },
          text: 'Share your idea and possible dates from Italy. We will discuss the design and session plan before you arrange travel.',
          button: { label: 'Send your tattoo idea', href: travelEnquiry },
          note: 'An enquiry does not book an appointment, hotel or transfer.',
        }}
      />
    </main>
  )
}
