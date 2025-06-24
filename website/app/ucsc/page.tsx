'use client'

import { useMemo, useState, useEffect, useRef } from 'react'

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'

import list from './list.json'
import Container from '../components/Container.tsx'

import '../components/table.css'

// Custom hook to group data by organism
function useGroupedByOrganism() {
  return useMemo(() => {
    const grouped: Record<
      string,
      Array<{
        name: string
        scientificName: string
        organism: string
        description: string
        jbrowseLink: string
        ucscLink: string
        orderKey: number
      }>
    > = {}

    // Ensure ucscGenomes exists before trying to iterate
    if (list && list.ucscGenomes) {
      Object.entries(list.ucscGenomes as Record<string, any>).forEach(
        ([key, val]) => {
          const entry = {
            name: key,
            scientificName: val.scientificName,
            organism: val.organism,
            description: val.description,
            jbrowseLink: `https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`,
            ucscLink: `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`,
            orderKey: val.orderKey,
          }

          if (!grouped[val.organism]) {
            grouped[val.organism] = []
          }
          grouped[val.organism]!.push(entry)
        },
      )
    }

    return grouped
  }, [])
}

// Custom hook to initialize and manage selected entries
function useSelectedEntries(groupedByOrganism: Record<string, any[]> | undefined) {
  // We use a ref to track whether we've initialized the entries
  // This prevents re-initializing on every render
  const initializedRef = useRef(false)
  const [selectedEntries, setSelectedEntries] = useState<Record<string, string>>({})

  // Initialize selected entries with default values only when groupedByOrganism changes
  useEffect(() => {
    // Skip if we don't have data or if we've already initialized
    if (!groupedByOrganism || initializedRef.current) return
    
    // Mark as initialized
    initializedRef.current = true
    
    const newSelectedEntries: Record<string, string> = {}

    // Loop through all organisms and set default selections
    Object.entries(groupedByOrganism).forEach(([organism, entries]) => {
      if (entries && entries.length > 0) {
        // Select the entry with the lowest orderKey by default
        const sortedEntries = [...entries].sort(
          (a, b) => a.orderKey - b.orderKey,
        )
        if (sortedEntries.length > 0 && sortedEntries[0]) {
          newSelectedEntries[organism] = sortedEntries[0].name
        }
      }
    })

    // Only set if we have entries to set
    if (Object.keys(newSelectedEntries).length > 0) {
      setSelectedEntries(newSelectedEntries)
    }
  }, [groupedByOrganism]) // Only depend on groupedByOrganism, not on selectedEntries

  // Handle selection change
  const handleSelectChange = (organism: string, entryName: string) => {
    setSelectedEntries(prev => ({
      ...prev,
      [organism]: entryName,
    }))
  }

  return { selectedEntries, handleSelectChange }
}

// Custom hook to transform data for the table
function useTableData(
  groupedByOrganism: Record<string, any[]> | undefined,
  selectedEntries: Record<string, string>,
) {
  return useMemo(() => {
    if (!groupedByOrganism) return []

    return Object.entries(groupedByOrganism)
      .map(([organism, entries]) => {
        if (!entries || entries.length === 0) {
          return null // Skip empty entries
        }

        // Make sure we have a valid entry to use
        const selectedEntryName = selectedEntries[organism] || ''
        const selectedEntry =
          selectedEntryName && entries.length > 0
            ? entries.find(entry => entry.name === selectedEntryName)
            : undefined

        // Fallback to first entry if selected entry is not found
        const entryToUse =
          selectedEntry || (entries.length > 0 ? entries[0] : null)

        // Skip if no valid entry is found
        if (!entryToUse) {
          return null
        }

        return {
          organism,
          entries,
          selectedEntry: entryToUse,
          name: entryToUse.name,
          scientificName: entryToUse.scientificName,
          description: entryToUse.description,
          jbrowseLink: entryToUse.jbrowseLink,
          ucscLink: entryToUse.ucscLink,
          orderKey: Math.min(...entries.map(e => e.orderKey)), // Use the lowest orderKey for sorting
        }
      })
      .filter(Boolean) as Array<{
      organism: string
      entries: Array<{
        name: string
        scientificName: string
        organism: string
        description: string
        jbrowseLink: string
        ucscLink: string
        orderKey: number
      }>
      selectedEntry: {
        name: string
        scientificName: string
        organism: string
        description: string
        jbrowseLink: string
        ucscLink: string
        orderKey: number
      }
      name: string
      scientificName: string
      description: string
      jbrowseLink: string
      ucscLink: string
      orderKey: number
    }>
  }, [groupedByOrganism, selectedEntries])
}

export default function UCSC() {
  // Create state for sorting
  const [sorting, setSorting] = useState<SortingState>([])
  
  // Use our custom hooks
  const groupedByOrganism = useGroupedByOrganism()
  const { selectedEntries, handleSelectChange } = useSelectedEntries(groupedByOrganism)
  const data = useTableData(groupedByOrganism, selectedEntries)

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper<(typeof data)[0]>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => {
          const row = info.row.original
          if (row.entries.length <= 1) {
            return info.getValue()
          }

          return (
            <select
              value={row.name}
              onChange={e => handleSelectChange(row.organism, e.target.value)}
              onClick={e => e.stopPropagation()}
              className="select-version"
            >
              {row.entries.map(entry => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          )
        },
      }),
      columnHelper.accessor('scientificName', {
        header: 'Scientific name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('organism', {
        header: 'Organism',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('jbrowseLink', {
        header: 'JBrowse',
        cell: info => <Link href={info.getValue()}>JBrowse</Link>,
      }),
      columnHelper.accessor('ucscLink', {
        header: 'UCSC',
        cell: info => <Link href={info.getValue()}>UCSC</Link>,
      }),
    ],
    [columnHelper, handleSelectChange],
  )

  // Create table instance
  const table = useReactTable({
    data: data.sort((a, b) => a.orderKey - b.orderKey),
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Container>
      <h1>Main UCSC browsers</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: ' ↑',
                    desc: ' ↓',
                  }[header.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  )
}
