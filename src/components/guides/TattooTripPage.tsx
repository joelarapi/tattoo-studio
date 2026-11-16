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
import { pathForDoc } from '@/lib/routes'

export type TattooTripGuide = {
  country: 'Germany' | 'Poland'
  language: 'German' | 'Polish'
  flightCopy: string
  entryCopy: string
  entrySource: string
}

const travelEnquiry = '/contact?travel=1#tattoo-enquiry'

const featuredSlugs = [
  'jesus-portrait-cross-tattoo',
  'family-memory-full-sleeve-tattoo',
  'aztec-inspired-chest-shoulder-tattoo',
  'archangel-mary-full-sleeve-tattoo',
  'lion-compass-forearm-tattoo',
  'woman-portrait-forearm-tattoo',
  'lion-cub-family-sleeve-tattoo',
  'joker-playing-cards-sleeve',
]

export async function TattooTripPage({ guide }: { guide: TattooTripGuide }) {
  const { country } = guide
  const [settings, allPieces, posts] = await Promise.all([
    getSiteSettings(),
    getPortfolioItems(),
    getLatestPosts(3),
  ])
  const pieces = [
    ...featuredSlugs.flatMap((slug) => allPieces.filter((piece) => piece.slug === slug)),
    ...allPieces.filter((piece) => !featuredSlugs.includes(piece.slug ?? '')),
  ].slice(0, 8)
  const heroPiece = pieces[0]
  const heroImage = heroPiece?.images?.[0] ?? heroPiece?.videoPoster
  const location =
    [settings.address?.city, settings.address?.country].filter(Boolean).join(', ') || 'Albania'
  const city = settings.address?.city || 'the studio’s city'
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
          <span aria-current="page">From {country}</span>
        </nav>
        <div className="mt-[75px] max-w-[900px] md:mt-[105px]">
          <Tag>Tattoo travel / {country} to Albania</Tag>
          <StyledHeading
            as="h1"
            value={{ text: `Tattoo trip from ${country}`, accent: 'to Albania.' }}
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
        <span>A journey with purpose.</span>
        <span>{location}.</span>
      </div>

      <section className="px-site py-section">
        <SectionHead
          number={1}
          layout="stackedUntilWide"
          tag={`Why travel from ${country}`}
          heading={{ text: 'Make the journey.', soft: 'Make it yours.' }}
          intro="Start with the work and your design. Once the session plan is clear, choose travel dates that leave room for the journey and the tattoo."
        />
        <NumberedCards
          columns={2}
          cards={[
            {
              title: 'Compare your flights.',
              text: `Look at airports convenient to you in ${country}, then check the arrival time in Tirana and the onward journey before choosing a fare.`,
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
              title: 'Plan the whole stay.',
              text: 'Allow time to reach the studio, get tattooed and travel home. Add flights, baggage, transport and accommodation to your tattoo budget.',
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
          intro="Real tattoo projects from the studio. Open a piece to see more detail and start a conversation about your idea."
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
          tag={`Getting here from ${country}`}
          heading={{ text: 'Fly into Tirana.', soft: 'Continue on to the studio.' }}
          intro="Flight routes and ground connections change. Check the operator for your dates after your appointment is confirmed."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-md border border-line bg-panel p-7 md:p-9">
            <Tag>{country} to Tirana</Tag>
            <h3 className="text-h3">Find the flight that fits your session.</h3>
            <p className="mt-4">{guide.flightCopy}</p>
            <div className="mt-7">
              <Action href="https://www.tirana-airport.com/en/flights" variant="plain">
                Check Tirana flights
              </Action>
            </div>
          </article>
          <article className="rounded-md border border-line bg-panel p-7 md:p-9">
            <Tag>Tirana to the studio</Tag>
            <h3 className="text-h3">Leave time for the onward trip.</h3>
            <p className="mt-4">
              Tirana International Airport lists a bus connection to {city}. Check its current
              departure times and pickup point, especially if your flight arrives late. Ask for the
              exact studio address when the appointment is confirmed.
            </p>
            <div className="mt-7">
              <Action
                href="https://www.tirana-airport.com/en/transport-and-directions/15/By-BusTravel"
                variant="plain"
              >
                Check airport buses
              </Action>
            </div>
          </article>
        </div>
        <p className="mt-5 max-w-[800px] text-[14px] text-faint">
          If you arrive late, consider an overnight stop before your appointment. Travel times and
          available connections depend on the date and operator.
        </p>
      </section>

      <section className="px-site py-section">
        <SectionHead
          number={4}
          tag={`From ${country} to the chair`}
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
              'An enquiry starts a conversation. Book flights and a place to stay after your appointment is confirmed.',
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
          tag="Plan the whole trip"
          heading={{ text: 'Time for the work.', soft: 'Room for the journey.' }}
          intro="Agree the likely session plan with the studio, then choose a stay that gives you a clear appointment day and an unhurried return."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              'A focused visit',
              'One appointment may fit a shorter stay if the design allows it. Keep arrival and departure away from your session where possible.',
            ],
            [
              'A longer stay',
              'Leave more time to settle in, discuss the design and see Albania. Confirm any extra sitting before you arrange travel.',
            ],
            [
              'A multi-session piece',
              'A sleeve or larger project may need several sessions and another visit. Ask what can realistically be completed this time.',
            ],
          ].map(([title, text]) => (
            <article key={title} className="rounded-md border border-line bg-panel p-7">
              <h3 className="text-h3">{title}</h3>
              <p className="mt-4">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-[850px]">
          Compare the individual tattoo quote alongside flights, baggage, local transport and
          accommodation. If the coast or sightseeing is part of your trip, plan sun and swimming
          before the tattoo where possible.
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
            Your tattoo will still be healing when you return to {country}. Ask for aftercare
            guidance specific to your piece and plan your flight home with that advice in mind.
          </p>
        </div>
        <ul className="border-t border-line-strong">
          {[
            'Leave breathing room between your last session and the trip home when you can.',
            'Wear loose clothing that will not rub against the tattoo.',
            'Keep your aftercare instructions handy, and check your airline’s rules for liquids.',
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
        id={`${country.toLowerCase()}-enquiry`}
        className="grid gap-10 bg-band px-site py-section md:grid-cols-[1fr_1.35fr] md:gap-[8%]"
      >
        <div>
          <Tag number={7}>Enquiry from {country}</Tag>
          <StyledHeading
            value={{ text: 'Got an idea?', accent: 'Make it yours.' }}
            className="text-h2"
          />
          <p className="mt-6">
            Tell us what you want, its placement and approximate size, and when you could travel
            from {country}. Add reference photos if they help explain your direction.
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
          <Tag number={8}>FAQ for visitors from {country}</Tag>
          <StyledHeading value={{ text: 'Know before', soft: 'you travel.' }} className="text-h2" />
        </div>
        <div>
          {[
            {
              q: 'What documents do I need to enter Albania?',
              a: (
                <>
                  {guide.entryCopy}{' '}
                  <a
                    href={guide.entrySource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline"
                  >
                    current entry advice
                  </a>{' '}
                  before booking.
                </>
              ),
            },
            {
              q: 'How do I get from Tirana airport to the studio?',
              a: (
                <>
                  Tirana International Airport lists a bus connection to {city}. Check the{' '}
                  <a
                    href="https://www.tirana-airport.com/en/transport-and-directions/15/By-BusTravel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline"
                  >
                    latest timetable and pickup point
                  </a>{' '}
                  for your arrival time, then confirm the studio address before travelling.
                </>
              ),
            },
            {
              q: 'How many days should I plan for?',
              a: 'That depends on your design, the number of sessions and your travel connections. Discuss the tattoo with the studio first, then choose dates with enough time on either side.',
            },
            {
              q: `Can we communicate in ${guide.language}?`,
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
          text: `Share your idea and possible dates from ${country}. We will discuss the design and session plan before you arrange travel.`,
          button: { label: 'Send your tattoo idea', href: travelEnquiry },
          note: 'An enquiry does not book an appointment, hotel or transfer.',
        }}
      />
    </main>
  )
}
