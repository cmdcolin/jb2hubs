'use client'

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export const statusOrder = {
  'Complete Genome': 1,
  'Complete genome': 1,
  Chromosome: 2,
  Scaffold: 3,
  Contig: 4,
}

// List accepted sort direction values
export const sortOrder = ['asc', 'desc', ''] as const

