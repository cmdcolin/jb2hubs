'use client'

import { useMemo, useState } from 'react'

import type { AssemblyData } from '../util'

import './table.css'

type FilterOption = 'all' | 'refseq' | 'genbank'

interface SortColumn {
  columnKey: string
  direction: 'ASC' | 'DESC'
}
const statusOrder = ['Complete genome', 'Chromosome', 'Scaffold', 'Contig']

export default function DataTable({ rows }: { rows: AssemblyData[] }) {
  const [sortColumn, setSortColumn] = useState<SortColumn>()
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [showAllColumns, setShowAllColumns] = useState(false)

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
          // Special handling for assemblyStatus column
          const flipper = sortColumn.direction === 'ASC' ? 1 : -1
          if (sortColumn.columnKey === 'assemblyStatus') {
            const aStatus = a.assemblyStatus || ''
            const bStatus = b.assemblyStatus || ''

            // Get the index of each status in our custom order
            const aIndex = statusOrder.indexOf(aStatus)
            const bIndex = statusOrder.indexOf(bStatus)
            return (aIndex - bIndex) * flipper
          } else {
            // Default sorting for other columns
            const aValue = a[sortColumn.columnKey as keyof AssemblyData]
            const bValue = b[sortColumn.columnKey as keyof AssemblyData]
            return (
              (typeof aValue === 'number' && typeof bValue === 'number'
                ? aValue - bValue
                : String(aValue || '').localeCompare(String(bValue || ''))) *
              flipper
            )
          }
        })
      : filteredRows
  }, [filteredRows, sortColumn])

  const handleSort = (columnKey: string) => {
    if (sortColumn && sortColumn.columnKey === columnKey) {
      // Toggle direction if already sorting by this column
      if (sortColumn.direction === 'ASC') {
        setSortColumn({
          columnKey,
          direction: 'DESC',
        })
      } else if (sortColumn.direction === 'DESC') {
        setSortColumn(undefined)
      } else {
        setSortColumn({
          columnKey,
          direction: 'ASC',
        })
      }
    } else {
      setSortColumn({
        columnKey,
        direction: 'ASC',
      })
    }
  }

  // Helper to determine sort indicator
  const getSortIndicator = (columnKey: string) => {
    return sortColumn?.columnKey === columnKey
      ? sortColumn.direction === 'ASC'
        ? '↑'
        : '↓'
      : ''
  }

  const columns = [
    {
      field: 'commonName',
      title: 'Common Name',
      sortable: true,
    },
    {
      field: 'ncbiRefSeqCategory',
      title: 'Designated reference',
      sortable: true,
      extra: true,
    },
    {
      field: 'jbrowseLink',
      title: 'JBrowse',
      sortable: false,
    },
    {
      field: 'ucscBrowserLink',
      title: 'UCSC',
      sortable: false,
    },
    {
      field: 'igvBrowserLink',
      title: 'IGV',
      sortable: false,
    },
    {
      field: 'ncbiBrowserLink',
      title: 'NCBI GDV',
      sortable: false,
    },
    {
      field: 'assemblyStatus',
      title: 'Assembly status',
      sortable: true,
    },
    {
      field: 'submitterOrg',
      title: 'Submitter',
      sortable: false,
      extra: true,
    },
    {
      field: 'seqReleaseDate',
      title: 'Release date',
      sortable: true,
    },
    {
      field: 'scientificName',
      title: 'Scientific name',
      sortable: true,
    },
    {
      field: 'ncbiAssemblyName',
      title: 'NCBI assembly name',
      sortable: true,
      extra: true,
    },
    {
      field: 'taxonId',
      title: 'Taxonomy ID',
      sortable: true,
      extra: true,
    },
    {
      field: 'ucscDataLink',
      title: 'UCSC download',
      sortable: false,
    },
    {
      field: 'ncbiLink',
      title: 'NCBI portal',
      sortable: false,
    },
  ]

  return (
    <>
      <div
        style={{
          marginBottom: '10px',
        }}
      >
        <div>
          <label
            style={{
              marginRight: '15px',
            }}
          >
            <input
              type="radio"
              name="databaseFilter"
              value="all"
              checked={filterOption === 'all'}
              onChange={() => {
                setFilterOption('all')
              }}
            />
            All
          </label>
          <label
            style={{
              marginRight: '15px',
            }}
          >
            <input
              type="radio"
              name="databaseFilter"
              value="refseq"
              checked={filterOption === 'refseq'}
              onChange={() => {
                setFilterOption('refseq')
              }}
            />
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
            />
            GenBank only
          </label>
        </div>
        <div>
          <label
            style={{
              marginRight: '15px',
            }}
          >
            <input
              type="radio"
              checked={!showAllColumns}
              onChange={() => {
                setShowAllColumns(false)
              }}
            />
            Show essential columns
          </label>
          <label
            style={{
              marginRight: '15px',
            }}
          >
            <input
              type="radio"
              checked={showAllColumns}
              onChange={() => {
                setShowAllColumns(true)
              }}
            />
            Show all columns
          </label>
        </div>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              {columns
                .filter(column => showAllColumns || !column.extra)
                .map(column => (
                  <th
                    key={column.field}
                    className={column.sortable ? 'cursor-pointer' : ''}
                    onClick={
                      column.sortable
                        ? () => {
                            handleSort(column.field)
                          }
                        : undefined
                    }
                  >
                    {column.title}{' '}
                    {column.sortable ? getSortIndicator(column.field) : ''}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => {
              // Get visible columns
              const visibleColumns = columns.filter(
                column => showAllColumns || !column.extra,
              )

              return (
                <tr key={index}>
                  {visibleColumns.map(column => {
                    const field = column.field as keyof AssemblyData

                    // Render cell based on column field
                    switch (field) {
                      case 'commonName': {
                        return <td key={field}>{row.commonName}</td>
                      }
                      case 'ncbiRefSeqCategory': {
                        return <td key={field}>{row.ncbiRefSeqCategory}</td>
                      }
                      case 'jbrowseLink': {
                        return (
                          <td key={field}>
                            <a
                              target="_blank"
                              href={row.jbrowseLink}
                              rel="noopener noreferrer"
                            >
                              JBrowse
                            </a>
                          </td>
                        )
                      }
                      case 'ucscBrowserLink': {
                        return (
                          <td key={field}>
                            <a
                              target="_blank"
                              href={row.ucscBrowserLink}
                              rel="noopener noreferrer"
                            >
                              UCSC
                            </a>
                          </td>
                        )
                      }
                      case 'igvBrowserLink': {
                        return (
                          <td key={field}>
                            <a
                              target="_blank"
                              href={row.igvBrowserLink}
                              rel="noopener noreferrer"
                            >
                              IGV
                            </a>
                          </td>
                        )
                      }
                      case 'ncbiBrowserLink': {
                        return (
                          <td key={field}>
                            <a
                              target="_blank"
                              href={row.ncbiBrowserLink}
                              rel="noopener noreferrer"
                            >
                              NCBI
                            </a>
                          </td>
                        )
                      }
                      case 'assemblyStatus': {
                        return <td key={field}>{row.assemblyStatus}</td>
                      }
                      case 'submitterOrg': {
                        return <td key={field}>{row.submitterOrg}</td>
                      }
                      case 'seqReleaseDate': {
                        return (
                          <td key={field}>
                            {row.seqReleaseDate?.replace('00:00', '')}
                          </td>
                        )
                      }
                      case 'scientificName': {
                        return (
                          <td key={field}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div>{row.scientificName}</div>
                            </div>
                          </td>
                        )
                      }
                      case 'taxonId': {
                        return (
                          <td key={field}>
                            <a
                              href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${row.taxonId}&lvl=3&p=nuccore&lin=f&keep=1&srchmode=1&unlock`}
                            >
                              {row.taxonId}
                            </a>
                          </td>
                        )
                      }
                      case 'ucscDataLink': {
                        return (
                          <td key={field}>
                            <a
                              target="_blank"
                              href={row.ucscDataLink}
                              rel="noopener noreferrer"
                            >
                              UCSC
                            </a>
                          </td>
                        )
                      }
                      case 'ncbiLink': {
                        return (
                          <td key={field}>
                            <a
                              rel="noopener noreferrer"
                              target="_blank"
                              href={row.ncbiLink}
                            >
                              NCBI
                            </a>
                          </td>
                        )
                      }
                      default: {
                        return <td key={field}>{String(row[field] || '')}</td>
                      }
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
