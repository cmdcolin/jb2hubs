export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined
}

export const statusOrder: Record<string, number> = {
  'Complete Genome': 1,
  'Complete genome': 1,
  Chromosome: 2,
  Scaffold: 3,
  Contig: 4,
}

// List accepted sort direction values
export const sortOrder: ('asc' | 'desc' | '')[] = ['asc', 'desc', '']
