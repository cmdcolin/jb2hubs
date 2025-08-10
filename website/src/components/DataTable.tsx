import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'

import TableBody from './DataTable/components/TableBody.tsx'
import TableHeader from './DataTable/components/TableHeader.tsx'
import { useCategoryFilter } from './DataTable/hooks/useCategoryFilter.ts'
import { useColumnVisibility } from './DataTable/hooks/useColumnVisibility.ts'
import { useSearchFilter } from './DataTable/hooks/useSearchFilter.ts'
import { useTableColumns } from './DataTable/hooks/useTableColumns.tsx'
import { useTableSort } from './DataTable/hooks/useTableSort.ts'
import styles from './DataTable.module.css'
import Pagination from './Pagination.tsx'
import TableOptions from './TableOptions.tsx'

import type { RowData } from './DataTable/hooks/useTableColumns.tsx'

import '../styles/common-table.css'

export interface TableProps {
  rows: RowData[]
}

export default function DataTable({ rows }: TableProps) {
  // Apply category filter first
  const {
    filterOption,
    setFilterOption,
    filteredRows: categoryFilteredRows,
  } = useCategoryFilter(rows)

  // Then apply search filter to the category-filtered results
  const { searchQuery, setSearchQuery, filteredRows } =
    useSearchFilter(categoryFilteredRows)
  const { sorting, onSortingChange, handleSort, sortState, sortDirectionPre } =
    useTableSort()
  const { showAllColumns, setShowAllColumns } = useColumnVisibility()
  const { columns } = useTableColumns({ searchQuery, showAllColumns })
  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 200,
      },
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Search by common name, scientific name, NCBI assembly name, or accession number..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
            }}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
              }}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <TableOptions
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        showAllColumns={showAllColumns}
        setShowAllColumns={setShowAllColumns}
      />

      <div>
        <table>
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            handleSort={handleSort} // Use handleSort from useTableSort
            sortState={sortState} // Use sortState from useTableSort
            sortDirectionPre={sortDirectionPre} // Use sortDirectionPre from useTableSort
          />
          <TableBody rows={table.getRowModel().rows} />
        </table>
      </div>

      <Pagination table={table} />
    </>
  )
}
