import { useCallback, useEffect, useMemo, useState } from 'react'

import uFuzzy from '@leeoniya/ufuzzy'

// Configure ufuzzy for optimal performance
const uf = new uFuzzy({
  intraMode: 0, // single-char insertions
  intraIns: 0, // allow insertions
  intraSub: 0, // allow substitutions
  intraTrn: 0, // allow transpositions
  intraDel: 0, // allow deletions
  interLft: 0, // no left leeway
  interRgt: 0, // no right leeway
})

// Pre-computed search strings for better performance
const getSearchableText = row => {
  const commonName = row.commonName || ''
  const scientificName = row.scientificName || ''
  const ncbiAssemblyName = row.ncbiAssemblyName || ''

  return `${commonName} ${scientificName} ${ncbiAssemblyName}`
}

export function useSearchFilter(rows) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchQuery(params.get('search') || '')
  }, [])

  // Local state for immediate UI responsiveness
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        setSearchQuery(localSearchQuery)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localSearchQuery, searchQuery, setSearchQuery])

  // Update local state when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Memoize processed rows and search haystack for better performance
  const { processedRows, searchHaystack } = useMemo(() => {
    const processedRows = rows.map(row => ({
      ...row,
      _searchText: getSearchableText(row),
    }))

    const searchHaystack = processedRows.map(row => row._searchText)

    return { processedRows, searchHaystack }
  }, [rows])

  const filteredRows = useMemo(() => {
    // If no search query, return all rows
    const query = searchQuery.trim()
    if (!query) {
      return rows
    }

    // Use ufuzzy for fuzzy search
    const indexes = uf.filter(searchHaystack, query)

    if (indexes && indexes.length > 0) {
      // Map back to rows
      return indexes.map(idx => processedRows[idx])
    } else {
      return []
    }
  }, [rows, processedRows, searchHaystack, searchQuery])

  const handleSearchChange = useCallback(value => {
    setLocalSearchQuery(value)
  }, [])

  return {
    searchQuery: localSearchQuery,
    setSearchQuery: handleSearchChange,
    filteredRows,
  }
}
