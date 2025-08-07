import { useMemo, useState, useEffect } from 'react'

import { sortOrder } from '../utils.js'

export function useTableSort() {
  const [sortState, setSortState] = useState('');
  const [sortDirectionPre, setSortDirection] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSortState(params.get('sort') || '');
    const dir = params.get('dir');
    setSortDirection(sortOrder.includes(dir) ? dir : '');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (sortState) {
        params.set('sort', sortState);
      } else {
        params.delete('sort');
      }
      if (sortDirectionPre) {
        params.set('dir', sortDirectionPre);
      } else {
        params.delete('dir');
      }
      window.history.replaceState(null, '', `?${params.toString()}${window.location.hash}`);
    }
  }, [sortState, sortDirectionPre]);

  // Convert URL query params to TanStack table sorting state
  const sorting = useMemo(() => {
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
    updater,
  ) => {
    const newSorting = updater instanceof Function ? updater(sorting) : updater

    if (newSorting.length === 0) {
      setSortState('')
      setSortDirection('')
    } else {
      setSortState(newSorting[0]?.id ?? '')
      setSortDirection(newSorting[0]?.desc ? 'desc' : 'asc')
    }
  }

  // Function to handle sort
  const handleSort = (columnId) => {
    if (sortState === columnId) {
      // Toggle direction if already sorting by this column
      if (sortDirectionPre === 'asc') {
        setSortDirection('desc')
      } else if (sortDirectionPre === 'desc') {
        setSortDirection('')
        setSortState('')
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortState(columnId)
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
