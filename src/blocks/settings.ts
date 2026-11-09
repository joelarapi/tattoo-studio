import type { Field, SelectField, TextFieldSingleValidation } from 'payload'

/*
 * Options every section block shares. They're deliberately few: the owner picks from the design's
 * own backgrounds and heading sizes, never free colours or spacing.
 */

export const backgroundOptions = [
  { label: 'Plain', value: 'plain' },
  { label: 'Line above', value: 'line' },
  { label: 'Lines above and below', value: 'lines' },
  { label: 'Dark band', value: 'band' },
  { label: 'Grid', value: 'grid' },
] as const

export type Background = (typeof backgroundOptions)[number]['value']

const anchorPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

const validateAnchor: TextFieldSingleValidation = (value) =>
  !value || anchorPattern.test(value) || 'Use lowercase letters, numbers and dashes, e.g. "plan".'

/** "Section settings", folded away at the end of a block: background, ID and jump-link label. */
export function sectionSettings(defaultBackground: Background = 'plain'): Field {
  return {
    type: 'collapsible',
    label: 'Section settings',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'settings',
        type: 'group',
        label: false,
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'background',
                type: 'select',
                defaultValue: defaultBackground,
                options: [...backgroundOptions],
                admin: { width: '34%', isClearable: false },
              },
              {
                name: 'anchor',
                label: 'Section ID',
                type: 'text',
                validate: validateAnchor,
                admin: {
                  width: '33%',
                  description: 'For links to this section: "plan" makes /this-page#plan.',
                },
              },
              {
                name: 'jumpLabel',
                label: 'Jump-link label',
                type: 'text',
                admin: {
                  width: '33%',
                  description:
                    'Listed in the jump bar under the page top, e.g. "Plan your visit". Needs a section ID.',
                },
              },
            ],
          },
        ],
      },
    ],
  }
}

/** Heading size, from the design's three section sizes. */
export const headingSize = (defaultValue: 'lg' | 'md' | 'sm' = 'md'): SelectField => ({
  name: 'headingSize',
  type: 'select',
  defaultValue,
  options: [
    { label: 'Large', value: 'lg' },
    { label: 'Medium', value: 'md' },
    { label: 'Small', value: 'sm' },
  ],
  admin: { isClearable: false },
})
