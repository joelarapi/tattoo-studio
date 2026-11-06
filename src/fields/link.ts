import type { GroupField, TextFieldSingleValidation } from 'payload'

const allowedHref = /^(\/|#|https?:\/\/|mailto:|tel:)/i

/** Accepts site paths, page anchors, web addresses, email and phone links; blocks `javascript:` etc. */
export const validateHref: TextFieldSingleValidation = (value) => {
  if (!value) return true
  return allowedHref.test(value.trim())
    ? true
    : 'Start with "/" (a page on this site), "#" (a section), "https://", "mailto:" or "tel:".'
}

type LinkGroupArgs = {
  name: string
  label?: string
  description?: string
  required?: boolean
}

/** A button or link: the text people see, and where it goes. */
export function linkGroup({
  name,
  label,
  description,
  required = true,
}: LinkGroupArgs): GroupField {
  return {
    name,
    type: 'group',
    label,
    admin: { description },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            required,
            admin: { width: '50%', description: 'The text on the button. Keep it short.' },
          },
          {
            name: 'href',
            label: 'Link',
            type: 'text',
            required,
            validate: validateHref,
            admin: {
              width: '50%',
              description:
                'A page on this site like /journal, a section like #book, or a full web address.',
            },
          },
        ],
      },
    ],
  }
}
