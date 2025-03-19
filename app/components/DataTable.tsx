'use client'

import { useMemo, useState } from 'react'
import { DataGrid, type SortColumn } from 'react-data-grid'

import styles from '../page.module.css'
import 'react-data-grid/lib/styles.css'

// Define the type for our data
type LineData = {
  accession: string
  assembly: string
  scientificName: string
  commonName: string
  taxonId: string
  genArkClade: string
}

type DataTableProps = {
  rows: LineData[]
}

export function DataTable({ rows }: DataTableProps) {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) {
      return rows
    }

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        // @ts-expect-error
        const compResult = a[sort.columnKey].localeCompare(b[sort.columnKey])
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [rows, sortColumns])
  return (
    <DataGrid
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      className={styles.fillGrid}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      columns={[
        { key: 'jbrowseLink', name: 'jbrowseLink' },
        { key: 'accession', name: 'accession' },
        { key: 'assembly', name: 'assembly' },
        { key: 'scientificName', name: 'scientificName' },
        { key: 'commonName', name: 'commonName' },
        { key: 'taxonId', name: 'taxonId' },
        { key: 'genArkClade', name: 'genArkClade' },
      ]}
      rows={sortedRows}
      enableVirtualization={false}
    />
  )
}
