'use client'

import { useMemo, useState } from 'react'

import styles from '../page.module.css'
import './table.css'

// Define the type for our data
interface LineData {
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

interface DataTableProps {
  rows: LineData[]
}

type FilterOption = 'all' | 'refseq' | 'genbank'

interface SortColumn {
  columnKey: string
  direction: 'ASC' | 'DESC'
}

export function DataTable({ rows }: DataTableProps) {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([])
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
        const aValue = a[sort.columnKey as keyof LineData]
        const bValue = b[sort.columnKey as keyof LineData]
        const compResult = aValue.localeCompare(bValue)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [filteredRows, sortColumns])

  const handleSort = (columnKey: string) => {
    const currentSortColumn = sortColumns[0]

    if (currentSortColumn && currentSortColumn.columnKey === columnKey) {
      // Toggle direction if already sorting by this column
      setSortColumns([
        {
          columnKey,
          direction: currentSortColumn.direction === 'ASC' ? 'DESC' : 'ASC',
        },
      ])
    } else {
      // Set new sort column with ASC direction
      setSortColumns([{ columnKey, direction: 'ASC' }])
    }
  }

  // Helper to determine sort indicator
  const getSortIndicator = (columnKey: string) => {
    const sortColumn = sortColumns.find(col => col.columnKey === columnKey)
    if (!sortColumn) {
      return null
    }
    return sortColumn.direction === 'ASC' ? '↑' : '↓'
  }

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name="databaseFilter"
            value="all"
            checked={filterOption === 'all'}
            onChange={() => {
              setFilterOption('all')
            }}
          />{' '}
          All
        </label>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name="databaseFilter"
            value="refseq"
            checked={filterOption === 'refseq'}
            onChange={() => {
              setFilterOption('refseq')
            }}
          />{' '}
          RefSeq only
        </label>
        <label>
          <input
            type="radio"
            name="databaseFilter"
            value="genbank"
            checked={filterOption === 'genbank'}
            onChange={() => {
              setFilterOption('genbank')
            }}
          />{' '}
          GenBank only
        </label>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th
                onClick={() => {
                  handleSort('commonName')
                }}
                style={{ cursor: 'pointer' }}
              >
                Common Name {getSortIndicator('commonName')}
              </th>
              <th
                onClick={() => {
                  handleSort('accession')
                }}
                style={{ cursor: 'pointer' }}
              >
                Accession and link to NCBI {getSortIndicator('accession')}
              </th>
              <th
                onClick={() => {
                  handleSort('scientificName')
                }}
                style={{ cursor: 'pointer' }}
              >
                Scientific Name and Data Download{' '}
                {getSortIndicator('scientificName')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{row.commonName}</span>
                    <span>
                      <a
                        target="_blank"
                        href={row.jbrowseLink}
                        rel="noopener noreferrer"
                      >
                        [JBrowse]
                      </a>{' '}
                      <a
                        target="_blank"
                        href={row.ucscBrowserLink}
                        rel="noopener noreferrer"
                      >
                        [UCSC]
                      </a>
                    </span>
                  </div>
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.ncbiLink}
                    rel="noopener noreferrer"
                  >
                    {row.ncbiName}
                  </a>
                </td>
                <td>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <a
                      target="_blank"
                      href={row.ucscDataLink}
                      rel="noopener noreferrer"
                    >
                      {row.scientificName}
                    </a>
                    <div>(taxId:{row.taxonId})</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
