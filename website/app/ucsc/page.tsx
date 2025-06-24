'use client'

import { useMemo, useState, useEffect } from 'react'

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

export default function UCSC() {
  // Create state for sorting
  const [sorting, setSorting] = useState<SortingState>([])
  // State to track selected entry for each organism
  const [selectedEntries, setSelectedEntries] = useState<
    Record<string, string>
  >({})

  // Group data by organism
  const groupedByOrganism = useMemo(() => {
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

  // Initialize selected entries if not already set
  useEffect(() => {
    // Skip if groupedByOrganism is undefined
    if (!groupedByOrganism) return

    const newSelectedEntries = { ...selectedEntries }

    // Loop through all organisms and set default selections
    // TypeScript doesn't understand we've already checked groupedByOrganism is defined
    Object.entries(groupedByOrganism as Record<string, any[]>).forEach(
      ([organism, entries]) => {
        if (!newSelectedEntries[organism] && entries && entries.length > 0) {
          // Select the entry with the lowest orderKey by default
          const sortedEntries = [...entries].sort(
            (a, b) => a.orderKey - b.orderKey,
          )
          if (sortedEntries.length > 0 && sortedEntries[0]) {
            newSelectedEntries[organism] = sortedEntries[0].name
          }
        }
      },
    )

    setSelectedEntries(newSelectedEntries)
  }, [groupedByOrganism, selectedEntries])

  // Transform the grouped data for the table
  const data = useMemo(() => {
    if (!groupedByOrganism) return []

    // Use type assertion to tell TypeScript that groupedByOrganism is defined
    return Object.entries(groupedByOrganism as Record<string, any[]>)
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

  // Handle selection change
  const handleSelectChange = (organism: string, entryName: string) => {
    setSelectedEntries(prev => ({
      ...prev,
      [organism]: entryName,
    }))
  }

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
