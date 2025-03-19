'use client'

import { DataGrid } from 'react-data-grid'

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
  initialData: LineData[]
}

export function DataTable({ initialData }: DataTableProps) {
  return (
    <DataGrid
      columns={[
        { key: 'accession', name: 'accession' },
        { key: 'assembly', name: 'assembly' },
        { key: 'scientificName', name: 'scientificName' },
        { key: 'commonName', name: 'commonName' },
        { key: 'taxonId', name: 'taxonId' },
        { key: 'genArkClade', name: 'genArkClade' },
      ]}
      rows={initialData}
    />
  )
}
