'use client'

import { useMemo, useState } from 'react'

import type { AssemblyData } from '../util'

import './table.css'

type FilterOption = 'all' | 'refseq' | 'genbank'

interface SortColumn {
  columnKey: string
  direction: 'ASC' | 'DESC'
}

export function DataTable({ rows }: { rows: AssemblyData[] }) {
  const [sortColumn, setSortColumn] = useState<SortColumn>()
  const [filterOption, setFilterOption] = useState<FilterOption>('all')

  const filteredRows = useMemo(() => {
    if (filterOption === 'all') {
      return rows
    } else if (filterOption === 'refseq') {
      return rows.filter(row => row.ncbiName.startsWith('GCF_'))
    } else {
      return rows.filter(row => row.ncbiName.startsWith('GCA_'))
    }
  }, [rows, filterOption])

  const sortedRows = useMemo(() => {
    return sortColumn
      ? filteredRows.toSorted((a, b) => {
          const aValue = a[sortColumn.columnKey as keyof AssemblyData]
          const bValue = b[sortColumn.columnKey as keyof AssemblyData]
          const compResult =
            typeof aValue === 'number'
              ? // @ts-expect-error
                aValue - bValue
              : // @ts-expect-error
                aValue.localeCompare(bValue)
          return sortColumn.direction === 'ASC' ? compResult : -compResult
        })
      : filteredRows
  }, [filteredRows, sortColumn])

  const handleSort = (columnKey: string) => {
    if (sortColumn && sortColumn.columnKey === columnKey) {
      // Toggle direction if already sorting by this column
      setSortColumn({
        columnKey,
        direction: sortColumn.direction === 'ASC' ? 'DESC' : 'ASC',
      })
    } else {
      // Set new sort column with ASC direction
      setSortColumn({ columnKey, direction: 'ASC' })
    }
  }

  // Helper to determine sort indicator
  const getSortIndicator = (columnKey: string) => {
    return sortColumn?.columnKey === columnKey
      ? sortColumn?.direction === 'ASC'
        ? '↑'
        : '↓'
      : ''
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

      <div>
        <table>
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => {
                  handleSort('commonName')
                }}
              >
                Common Name {getSortIndicator('commonName')}
              </th>
              <th>JBrowse</th>
              <th>UCSC</th>
              <th>IGV</th>
              <th>NCBI GDV</th>
              <th
                className="cursor-pointer"
                onClick={() => {
                  handleSort('scientificName')
                }}
              >
                Scientific name
                {getSortIndicator('scientificName')}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => {
                  handleSort('taxonId')
                }}
              >
                Taxonomy ID
                {getSortIndicator('taxonId')}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => {
                  handleSort('accession')
                }}
              >
                Accession {getSortIndicator('accession')}
              </th>
              <th>UCSC download</th>
              <th>NCBI portal</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <span>{row.commonName}</span>
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.jbrowseLink}
                    rel="noopener noreferrer"
                  >
                    JBrowse
                  </a>{' '}
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.ucscBrowserLink}
                    rel="noopener noreferrer"
                  >
                    UCSC
                  </a>
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.igvBrowserLink}
                    rel="noopener noreferrer"
                  >
                    IGV
                  </a>
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.ncbiBrowserLink}
                    rel="noopener noreferrer"
                  >
                    NCBI
                  </a>
                </td>

                <td>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>{row.scientificName}</div>
                  </div>
                </td>
                <td>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${row.taxonId}&lvl=3&p=nuccore&lin=f&keep=1&srchmode=1&unlock`}
                  >
                    {row.taxonId}
                  </a>
                </td>
                <td>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {row.ncbiName}{' '}
                  </div>
                </td>
                <td>
                  <a
                    target="_blank"
                    href={row.ucscDataLink}
                    rel="noopener noreferrer"
                  >
                    UCSC
                  </a>
                </td>
                <td>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={row.ncbiLink}
                  >
                    NCBI
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
