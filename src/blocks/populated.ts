/** The populated documents of a relationship (bare IDs mean unpublished, deleted or not loaded). */
export function populated<T extends object>(value: (number | T)[] | null | undefined): T[] {
  return (value ?? []).filter((item): item is T => typeof item === 'object' && item !== null)
}

/** A single populated relationship, or null. */
export function populatedOne<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null
}
