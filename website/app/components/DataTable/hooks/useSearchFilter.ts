'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

import uFuzzy from '@leeoniya/ufuzzy'
import { parseAsString, useQueryState } from 'nuqs'

import type { AssemblyData } from '../../util.ts'

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
const getSearchableText = (row: NonNullable<AssemblyData>) => {
  const commonName = row.commonName || ''
  const scientificName = row.scientificName || ''
  const ncbiAssemblyName = row.ncbiAssemblyName || ''

  return `${commonName} ${scientificName} ${ncbiAssemblyName}`
}

// Calculate priority score for search results
const calculatePriorityScore = (
  row: NonNullable<AssemblyData>,
  query: string,
) => {
  const queryLower = query.toLowerCase().trim()
  const commonName = (row.commonName || '').toLowerCase()
  const scientificName = (row.scientificName || '').toLowerCase()
  const ncbiAssemblyName = (row.ncbiAssemblyName || '').toLowerCase()

  let score = 0

  // Exact matches get highest priority
  if (commonName === queryLower) score += 1000
  else if (scientificName === queryLower) score += 900
  else if (ncbiAssemblyName === queryLower) score += 800
  // Starts with matches get second priority
  else if (commonName.startsWith(queryLower)) score += 700
  else if (scientificName.startsWith(queryLower)) score += 600
  else if (ncbiAssemblyName.startsWith(queryLower)) score += 500
  // Contains matches get third priority
  else if (commonName.includes(queryLower)) score += 400
  else if (scientificName.includes(queryLower)) score += 300
  else if (ncbiAssemblyName.includes(queryLower)) score += 200
  // Fuzzy matches get base priority
  else score += 100

  return score
}

export function useSearchFilter(rows: AssemblyData[]) {
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

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
      // @ts-expect-error
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

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value)
  }, [])

  return {
    searchQuery: localSearchQuery,
    setSearchQuery: handleSearchChange,
    filteredRows,
  }
}
