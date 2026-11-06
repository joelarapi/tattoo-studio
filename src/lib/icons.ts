/*
 * Names of the line-art icons editors can pick in the CMS (styles, standards). The SVGs live in
 * the frontend icon component (Phase 4); adding an icon means adding it here and there.
 */
export const iconOptions = [
  { label: 'Fine line', value: 'fine-line' },
  { label: 'Blackwork', value: 'blackwork' },
  { label: 'Realism', value: 'realism' },
  { label: 'Traditional', value: 'traditional' },
  { label: 'Lettering', value: 'lettering' },
  { label: 'Cover-up', value: 'cover-up' },
  { label: 'Geometric', value: 'geometric' },
  { label: 'Dotwork', value: 'dotwork' },
  { label: 'Needle', value: 'needle' },
  { label: 'Ink drop', value: 'ink' },
  { label: 'Certificate', value: 'certificate' },
  { label: 'Healing hand', value: 'aftercare' },
  { label: 'Shield', value: 'shield' },
  { label: 'Compass', value: 'compass' },
] as const

export type IconName = (typeof iconOptions)[number]['value']
