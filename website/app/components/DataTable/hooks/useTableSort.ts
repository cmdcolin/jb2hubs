'use client'
import { useMemo } from 'react'
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { sortOrder } from '../utils'
import type { SortingState } from '@tanstack/react-table'

export function useTableSort() {
  const [sortState, setSortState] = useQueryState(
    'sort',
    parseAsString.withDefault(''),
  )

  const [sortDirectionPre, setSortDirection] = useQueryState(
    'dir',
    parseAsStringLiteral(sortOrder),
  )

  // Convert URL query params to TanStack table sorting state
  const sorting = useMemo<SortingState>(() => {
    if (sortState && sortDirectionPre) {
      return [
        {
          id: sortState,
          desc: sortDirectionPre === 'desc',
        },
      ]
    }
    return []
  }, [sortState, sortDirectionPre])

  // Update URL query params when sorting changes
  const onSortingChange = (
    updater: ((state: SortingState) => SortingState) | SortingState,
  ) => {
    const newSorting = updater instanceof Function ? updater(sorting) : updater

    if (newSorting.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState('')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection('')
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(newSorting[0]?.id ?? '')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection(newSorting[0]?.desc ? 'desc' : 'asc')
    }
  }

  // Function to handle sort
  const handleSort = (columnId: string) => {
    if (sortState === columnId) {
      // Toggle direction if already sorting by this column
      if (sortDirectionPre === 'asc') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('desc')
      } else if (sortDirectionPre === 'desc') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('')
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortState('')
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('asc')
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(columnId)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection('asc')
    }
  }

  return {
    sorting,
    onSortingChange,
    handleSort,
    sortState,
    sortDirectionPre,
  }
}

