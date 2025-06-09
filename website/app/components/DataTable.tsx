'use client'

import { useMemo } from 'react'

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table'
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
const sortOrder = ['asc', 'desc', ''] as const

export default function DataTable({
  rows,
}: {
  rows: NonNullable<AssemblyData>[]
}) {
  const [sortState, setSortState] = useQueryState(
    'sort',
    parseAsString.withDefault(''),
  )

  const [sortDirectionPre, setSortDirection] = useQueryState(
    'dir',
    parseAsStringLiteral(sortOrder),
  )

  const [filterOption, setFilterOption] = useQueryState(
    'filter',
    parseAsStringLiteral(Object.keys(filterCategories)),
  )

  const [showAllColumns, setShowAllColumns] = useQueryState(
    'show',
    parseAsBoolean.withDefault(false),
  )

  // Convert URL query params to TanStack table sorting state
  const sorting = useMemo<SortingState>(() => {
    if (sortState && sortDirectionPre) {
      return [
        {
          id: sortState,
          desc: sortDirectionPre === 'desc',
        },
      ]
    }
    return []
  }, [sortState, sortDirectionPre])

  // Update URL query params when sorting changes
  const onSortingChange = (
    updater: ((state: SortingState) => SortingState) | SortingState,
  ) => {
    const newSorting = updater instanceof Function ? updater(sorting) : updater

    if (newSorting.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState('')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection('')
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(newSorting[0]?.id || '')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection(newSorting[0]?.desc ? 'desc' : 'asc')
    }
  }

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

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper<NonNullable<AssemblyData>>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('commonName', {
        header: () => (
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
                <X stroke="red" className="w-[1em] h-[1em]" /> == &quot;refseq
                suppressed&quot;
              </div>
            </div>
          </div>
        ),
        cell: info => (
          <>
            {info.getValue()}{' '}
            <Link
              target="_blank"
              href={`/accession/${info.row.original.accession}`}
              rel="noopener noreferrer"
            >
              (info)
            </Link>{' '}
            {info.row.original.ncbiRefSeqCategory === 'reference genome' ? (
              <Star fill="orange" strokeWidth={0} className="w-[1em] h-[1em]" />
            ) : null}
            {info.row.original.suppressed ? (
              <X stroke="red" className="w-[1em] h-[1em]" />
            ) : null}
          </>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('jbrowseLink', {
        header: 'JBrowse',
        cell: info => (
          <a target="_blank" href={info.getValue()} rel="noopener noreferrer">
            JBrowse
          </a>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('ucscBrowserLink', {
        header: 'UCSC',
        cell: info => (
          <a target="_blank" href={info.getValue()} rel="noopener noreferrer">
            UCSC
          </a>
        ),
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor('igvBrowserLink', {
        header: 'IGV',
        cell: info => (
          <a target="_blank" href={info.getValue()} rel="noopener noreferrer">
            IGV
          </a>
        ),
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor('ncbiBrowserLink', {
        header: 'NCBI GDV',
        cell: info => (
          <a target="_blank" href={info.getValue()} rel="noopener noreferrer">
            NCBI
          </a>
        ),
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor('assemblyStatus', {
        header: 'Assembly status',
        cell: info => info.getValue(),
        enableSorting: true,
        sortingFn: (
          rowA: Row<NonNullable<AssemblyData>>,
          rowB: Row<NonNullable<AssemblyData>>,
        ) => {
          const a =
            statusOrder[
              rowA.original.assemblyStatus as keyof typeof statusOrder
            ] || 999
          const b =
            statusOrder[
              rowB.original.assemblyStatus as keyof typeof statusOrder
            ] || 999
          return a - b
        },
      }),
      columnHelper.accessor('submitterOrg', {
        header: 'Submitter',
        cell: info => info.getValue(),
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor('seqReleaseDate', {
        header: 'Release date',
        cell: info => info.getValue().replace('00:00', ''),
        enableSorting: true,
      }),
      columnHelper.accessor('scientificName', {
        header: 'Scientific name',
        cell: info => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{info.getValue()}</div>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('ncbiAssemblyName', {
        header: 'NCBI assembly name',
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor('accession', {
        header: 'Accession',
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor('taxonId', {
        header: 'Taxonomy ID',
        cell: info => (
          <a
            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${info.getValue()}&lvl=3&p=nuccore&lin=f&keep=1&srchmode=1&unlock`}
          >
            {info.getValue()}
          </a>
        ),
        enableSorting: true,
        meta: { extra: true },
      }),
    ],
    [columnHelper],
  )

  // Create table instance
  const table = useReactTable({
    data: filteredRows,
    columns: columns.filter(
      col => showAllColumns || !(col.meta as { extra?: boolean })?.extra,
    ),
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Function to handle sort
  const handleSort = (columnId: string) => {
    if (sortState === columnId) {
      // Toggle direction if already sorting by this column
      if (sortDirectionPre === 'asc') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('desc')
      } else if (sortDirectionPre === 'desc') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('')
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortState('')
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection('asc')
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(columnId)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection('asc')
    }
  }

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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={
                      header.column.getCanSort() ? 'cursor-pointer' : ''
                    }
                    onClick={
                      header.column.getCanSort()
                        ? () => {
                            handleSort(header.id)
                          }
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{' '}
                    {header.column.getCanSort()
                      ? sortState === header.id
                        ? sortDirectionPre === 'asc'
                          ? '↑'
                          : '↓'
                        : ''
                      : ''}
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
      </div>
    </>
  )
}
