import { useCallback, useEffect, useMemo, useState } from 'react'

import uFuzzy from '@leeoniya/ufuzzy'

import { RowData } from './useTableColumns.tsx'

// Define a new interface that extends RowData and includes _searchText
interface SearchableRowData extends RowData {
  _searchText: string;
}

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
const getSearchableText = (row: RowData): string => {
  const commonName = row.commonName ?? ''
  const scientificName = row.scientificName ?? ''
  const ncbiAssemblyName = row.ncbiAssemblyName ?? ''
  const accession = row.accession ?? ''

  return `${commonName} ${scientificName} ${ncbiAssemblyName} ${accession}`
}

export function useSearchFilter(rows: RowData[]) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchQuery(params.get('search') ?? '')
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

    return () => {
      clearTimeout(timeoutId)
    }
  }, [localSearchQuery, searchQuery, setSearchQuery])

  // Update local state when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Memoize processed rows and search haystack for better performance
  const { processedRows, searchHaystack } = useMemo(() => {
    const processedRows: SearchableRowData[] = rows.map(row => ({
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
      // Map back to rows and filter out any undefined results
      return indexes
        .map(idx => processedRows[idx])
        .filter((row): row is SearchableRowData => row !== undefined)
        .map((row): RowData => {
          // Destructure to remove _searchText before returning as RowData
          const { _searchText, ...rest } = row
          return rest
        })
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