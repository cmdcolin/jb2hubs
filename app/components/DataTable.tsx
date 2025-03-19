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
  jbrowseLink: string
  ncbiLink: string
  ncbiName: string
  ucscDataLink: string
  ucscBrowserLink: string
}

type DataTableProps = {
  rows: LineData[]
}

export function DataTable({ rows }: DataTableProps) {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [filterOption, setFilterOption] = useState<FilterOption>('all')

  const filteredRows = useMemo(() => {
    if (filterOption === 'all') {
      return rows
    } else if (filterOption === 'refseq') {
      return rows.filter(row => row.accession.startsWith('GCF_'))
    } else {
      return rows.filter(row => row.accession.startsWith('GCA_'))
    }
  }, [rows, filterOption])

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) {
      return filteredRows
    }

    return [...filteredRows].sort((a, b) => {
      for (const sort of sortColumns) {
        // @ts-expect-error
        const compResult = a[sort.columnKey].localeCompare(b[sort.columnKey])
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [filteredRows, sortColumns])
  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name="databaseFilter"
            value="all"
            checked={filterOption === 'all'}
            onChange={() => setFilterOption('all')}
          />{' '}
          All
        </label>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name="databaseFilter"
            value="refseq"
            checked={filterOption === 'refseq'}
            onChange={() => setFilterOption('refseq')}
          />{' '}
          RefSeq only
        </label>
        <label>
          <input
            type="radio"
            name="databaseFilter"
            value="genbank"
            checked={filterOption === 'genbank'}
            onChange={() => setFilterOption('genbank')}
          />{' '}
          GenBank only
        </label>
      </div>
      <DataGrid
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        className={styles.fillGrid}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        columns={[
          {
            key: 'commonName',
            name: 'commonName',
            renderCell: args => {
              return (
                <>
                  <span style={{ float: 'left' }}>{args.row.commonName}</span>
                  <span style={{ float: 'right' }}>
                    <a target="_blank" href={args.row.jbrowseLink}>
                      [JBrowse]
                    </a>{' '}
                    <a target="_blank" href={args.row.ucscBrowserLink}>
                      [UCSC]
                    </a>
                  </span>
                </>
              )
            },
          },
          {
            key: 'accession',
            name: 'accession',
            renderCell: args => {
              return (
                <a target="_blank" href={args.row.ncbiLink}>
                  {args.row.ncbiName}
                </a>
              )
            },
          },
          {
            key: 'scientificName',
            name: 'scientificName and data download',
            renderCell: args => {
              return (
                <a target="_blank" href={args.row.ucscDataLink}>
                  {args.row.scientificName}
                </a>
              )
            },
          },
          {
            key: 'taxonId',
            name: 'taxonId',
          },
        ]}
        rows={sortedRows}
        enableVirtualization={false}
      />
    </>
  )
}
