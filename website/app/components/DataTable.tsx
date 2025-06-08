'use client'

import { useMemo } from 'react'

import { Star, X } from 'lucide-react'
import Link from 'next/link'
import {
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'nuqs'

import './table.css'

import type { AssemblyData } from './util'

const statusOrder = {
  'Complete Genome': 1,
  'Complete genome': 1,
  Chromosome: 2,
  Scaffold: 3,
  Contig: 4,
}

const filterCategories = {
  all: 'All',
  refseq: 'RefSeq only',
  genbank: 'GenBank only',
  designatedReference: 'Designated reference only',
  hidesuppressed: 'Hide suppressed',
}

// List accepted values
const sortOrder = ['ASC', 'DESC', ''] as const

export default function DataTable({
  rows,
}: {
  rows: NonNullable<AssemblyData>[]
}) {
  const [sortDirectionPre, setSortDirection] = useQueryState(
    'dir',
    parseAsStringLiteral(sortOrder),
  )
  const [sortColumn, setSortColumn] = useQueryState(
    'sort',
    parseAsString.withDefault(''),
  )

  const [filterOption, setFilterOption] = useQueryState(
    'filter',
    parseAsStringLiteral(Object.keys(filterCategories)),
  )

  const [showAllColumns, setShowAllColumns] = useQueryState(
    'show',
    parseAsBoolean.withDefault(false),
  )

  const sortDirection = sortDirectionPre ?? ''

  const filteredRows = useMemo(() => {
    switch (filterOption) {
      case 'all': {
        return rows
      }
      case 'refseq': {
        return rows.filter(r => r.ncbiName.startsWith('GCF_'))
      }
      case 'genbank': {
        return rows.filter(r => r.ncbiName.startsWith('GCA_'))
      }
      case 'designatedReference': {
        return rows.filter(r => r.ncbiRefSeqCategory === 'reference genome')
      }
      case 'hidesuppressed': {
        return rows.filter(r => !r.suppressed)
      }
      default: {
        return rows
      }
    }
  }, [rows, filterOption])

  const sortedRows = useMemo(() => {
    return sortDirection
      ? filteredRows.toSorted((a, b) => {
          // Special handling for assemblyStatus column
          const flipper = sortDirection === 'ASC' ? 1 : -1
          if (sortColumn === 'assemblyStatus') {
            return (
              (statusOrder[a.assemblyStatus as keyof typeof statusOrder] -
                statusOrder[b.assemblyStatus as keyof typeof statusOrder]) *
              flipper
            )
          } else {
            const aValue = a[sortColumn as keyof AssemblyData] as
              | string
              | number
              | undefined
            const bValue = b[sortColumn as keyof AssemblyData] as
              | string
              | number
              | undefined
            return (
              (typeof aValue === 'number' && typeof bValue === 'number'
                ? aValue - bValue
                : String(aValue ?? '').localeCompare(String(bValue ?? ''))) *
              flipper
            )
          }
        })
      : filteredRows
  }, [filteredRows, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSortColumn(columnKey)
    if (sortColumn === columnKey) {
      // Toggle direction if already sorting by this column
      if (sortDirection === 'ASC') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('DESC')
      } else if (sortDirection === 'DESC') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('')
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('ASC')
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection('ASC')
    }
  }

  const map = { ASC: '↑', DESC: '↓' }
  const getSortIndicator = (columnKey: string) =>
    sortColumn === columnKey ? map[sortDirection as keyof typeof map] : ''

  return (
    <>
      <div>
        <div>
          {Object.entries(filterCategories).map(([key, val]) => (
            <label
              key={key}
              style={{
                marginRight: 15,
              }}
            >
              <input
                type="radio"
                name="databaseFilter"
                value={key}
                checked={filterOption === key}
                onChange={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  setFilterOption(key as keyof typeof filterCategories)
                }}
              />
              {val}
            </label>
          ))}
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
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
              {[
                {
                  field: 'commonName',
                  title: (
                    <div>
                      <div style={{ float: 'left' }}>Common Name</div>
                      <div style={{ float: 'right' }}>
                        <div>
                          <Star
                            fill="orange"
                            strokeWidth={0}
                            className="w-[1em] h-[1em]"
                          />{' '}
                          == &quot;designated reference&quot;
                        </div>
                        <div>
                          <X stroke="red" className="w-[1em] h-[1em]" /> ==
                          &quot;refseq suppressed&quot;
                        </div>
                      </div>
                    </div>
                  ),
                  sortable: true,
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
                  extra: true,
                },
                {
                  field: 'igvBrowserLink',
                  title: 'IGV',
                  sortable: false,
                  extra: true,
                },
                {
                  field: 'ncbiBrowserLink',
                  title: 'NCBI GDV',
                  sortable: false,
                  extra: true,
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
                },
                {
                  field: 'accession',
                  title: 'Accession',
                  sortable: true,
                },

                {
                  field: 'taxonId',
                  title: 'Taxonomy ID',
                  sortable: true,
                  extra: true,
                },
              ]
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
            {sortedRows.map((row, index) => (
              <tr key={index}>
                {[
                  {
                    field: 'commonName',
                    title: (
                      <div>
                        <div style={{ float: 'left' }}>Common Name</div>
                        <div style={{ float: 'right' }}>
                          <div>
                            <Star
                              fill="orange"
                              strokeWidth={0}
                              className="w-[1em] h-[1em]"
                            />{' '}
                            == &quot;designated reference&quot;
                          </div>
                          <div>
                            <X stroke="red" className="w-[1em] h-[1em]" /> ==
                            &quot;refseq suppressed&quot;
                          </div>
                        </div>
                      </div>
                    ),
                    sortable: true,
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
                    extra: true,
                  },
                  {
                    field: 'igvBrowserLink',
                    title: 'IGV',
                    sortable: false,
                    extra: true,
                  },
                  {
                    field: 'ncbiBrowserLink',
                    title: 'NCBI GDV',
                    sortable: false,
                    extra: true,
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
                  },
                  {
                    field: 'accession',
                    title: 'Accession',
                    sortable: true,
                  },

                  {
                    field: 'taxonId',
                    title: 'Taxonomy ID',
                    sortable: true,
                    extra: true,
                  },
                ]
                  .filter(column => showAllColumns || !column.extra)
                  .map(column => {
                    const field = column.field as keyof AssemblyData

                    // Render cell based on column field
                    switch (field) {
                      case 'commonName': {
                        return (
                          <td key={field}>
                            {row.commonName}{' '}
                            {row.ncbiRefSeqCategory === 'reference genome' ? (
                              <Star
                                fill="orange"
                                strokeWidth={0}
                                className="w-[1em] h-[1em]"
                              />
                            ) : null}
                            {row.suppressed ? (
                              <X stroke="red" className="w-[1em] h-[1em]" />
                            ) : null}
                          </td>
                        )
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
                      case 'accession': {
                        return (
                          <td key={field}>
                            <Link
                              target="_blank"
                              href={`/accession/${row.accession}`}
                              rel="noopener noreferrer"
                            >
                              {row.accession}
                            </Link>
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
                            {row.seqReleaseDate.replace('00:00', '')}
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

                      default: {
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        return <td key={field}>{String(row[field] ?? '')}</td>
                      }
                    }
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
