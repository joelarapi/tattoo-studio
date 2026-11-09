import { cardList, paragraphs, section, tagField, text } from '@/fields/content'
import { styledHeading } from '@/fields/heading'
import { basicEditor } from '@/fields/richText'

import { pageGlobal } from './pageGlobal'

export const ContactPage = pageGlobal({
  slug: 'contact-page',
  label: 'Contact',
  description:
    'The contact page and the enquiry form (the form also appears on the homepage). Address, phone and hours are in Settings → Studio details.',
  tabs: [
    {
      label: 'Intro',
      fields: [
        section('hero', 'Next to the form', [
          tagField(),
          styledHeading({ description: 'The page title (H1). White, then grey, then orange.' }),
          paragraphs('intro'),
          text('studioLabel', 'Label above the address, e.g. "The studio".'),
          text('directLabel', 'Label above phone and email, e.g. "Direct contact".'),
          paragraphs('notice', 'The boxed note under the details. Optional.'),
        ]),
      ],
    },
    {
      label: 'Form',
      fields: [
        section(
          'form',
          'Enquiry form',
          [
            text('submitLabel', 'The button, e.g. "Send your tattoo idea".', true),
            paragraphs('helperText', 'Small text under the button. Optional.'),
            {
              name: 'privacyNote',
              type: 'richText',
              editor: basicEditor,
              admin: { description: 'Short note with a link to the privacy policy.' },
            },
            paragraphs(
              'pendingNotice',
              'Shown when someone presses the button while sending is not connected yet.',
              true,
            ),
            text('successHeading', 'Shown after a successful enquiry (once sending is connected).'),
            paragraphs('successMessage', 'Under the success heading.'),
          ],
          'Used on this page and on the homepage. Field labels are part of the design.',
        ),
      ],
    },
    {
      label: 'Next steps',
      fields: [
        section('next', 'What happens next', [
          tagField(),
          styledHeading(),
          cardList({ maxRows: 3 }),
        ]),
      ],
    },
    {
      label: 'Questions',
      fields: [
        section(
          'faq',
          'Questions',
          [tagField(), styledHeading()],
          'Shows the FAQs set to appear on Contact (Studio → FAQs).',
        ),
      ],
    },
  ],
})
