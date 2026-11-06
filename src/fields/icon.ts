import type { SelectField } from 'payload'

import { iconOptions } from '@/lib/icons'

export function iconField(overrides: Partial<SelectField> = {}): SelectField {
  return {
    name: 'icon',
    type: 'select',
    options: iconOptions.map((option) => ({ ...option })),
    required: true,
    admin: { description: 'The small line drawing shown next to the title.' },
    ...overrides,
  } as SelectField
}
