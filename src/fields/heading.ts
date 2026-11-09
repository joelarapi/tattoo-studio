import type { GroupField } from 'payload'

type StyledHeadingArgs = {
  name?: string
  label?: string
  required?: boolean
  description?: string
}

/**
 * A heading in the site's three tones: white, then grey, then orange (e.g. "Tattoos in Albania."
 * / "Your story." / "Our artistry."). Each part starts on a new line; Enter adds more line breaks.
 * Rendered by <StyledHeading>.
 */
export function styledHeading({
  name = 'heading',
  label = 'Heading',
  required = true,
  description = 'Up to three parts, shown in this order: white, grey, orange. Each part starts on a new line; press Enter for more line breaks.',
}: StyledHeadingArgs = {}): GroupField {
  return {
    name,
    label,
    type: 'group',
    admin: { description },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'text',
            label: 'White',
            type: 'textarea',
            required,
            admin: { width: '34%', rows: 2 },
          },
          { name: 'soft', label: 'Grey', type: 'textarea', admin: { width: '33%', rows: 2 } },
          { name: 'accent', label: 'Orange', type: 'textarea', admin: { width: '33%', rows: 2 } },
        ],
      },
    ],
  }
}
