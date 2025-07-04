'use client'
import { parseAsBoolean, useQueryState } from 'nuqs'

export function useColumnVisibility() {
  const [showAllColumns, setShowAllColumns] = useQueryState(
    'show',
    parseAsBoolean.withDefault(false),
  )

  return { showAllColumns, setShowAllColumns }
}

