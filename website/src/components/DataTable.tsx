import { useState } from 'react'

import {
  PaginationState,
  SortingState,
  flexRender,
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
import { RowData, useTableColumns } from './DataTable/hooks/useTableColumns.tsx'
import { useTableSort } from './DataTable/hooks/useTableSort.ts'
import styles from './DataTable.module.css'
import TableOptions from './TableOptions.tsx'

import '../styles/common-table.css'

export interface TableProps {
  rows: RowData[];
}

export default function DataTable({ rows }: TableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 200,
  })
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
  const { columns } = useTableColumns({ searchQuery })

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange,
    onPaginationChange: setPagination,
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
            onChange={e => { setSearchQuery(e.target.value) }}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery('') }}
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

      <div className={styles.paginationContainer}>
        <button
          className={styles.paginationButton}
          onClick={() => { table.setPageIndex(0) }}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => { table.previousPage() }}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <span className={styles.pageInfo}>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          className={styles.paginationButton}
          onClick={() => { table.nextPage() }}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => { table.setPageIndex(table.getPageCount() - 1) }}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <div className={styles.pageSizeSelector}>
          <label htmlFor="pageSize">Show:</label>
          <select
            id="pageSize"
            value={pagination.pageSize}
            onChange={e => {
              const newSize = Number(e.target.value)
              setPagination({
                pageIndex: 0,
                pageSize: newSize,
              })
            }}
            className={styles.pageSizeSelect}
          >
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={10000}>10000</option>
          </select>
          <span>rows</span>
        </div>
        <span className={styles.rowCount}>
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} rows
        </span>
      </div>
    </>
  )
}