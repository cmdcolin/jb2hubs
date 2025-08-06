'use client'
import { useState } from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import TableBody from './DataTable/components/TableBody.tsx'
import TableHeader from './DataTable/components/TableHeader.tsx'
import { useColumnVisibility } from './DataTable/hooks/useColumnVisibility.ts'
import { useTableColumns } from './DataTable/hooks/useTableColumns.tsx'
import { useTableFilter } from './DataTable/hooks/useTableFilter.ts'
import { useTableSort } from './DataTable/hooks/useTableSort.ts'
import TableOptions from './TableOptions.tsx'

import type { AssemblyData } from './util'

import './table.css'
import styles from './DataTable.module.css'

export default function DataTable({ rows }: { rows: AssemblyData[] }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  })
  const { filterOption, setFilterOption, filteredRows } = useTableFilter(rows)
  const { sorting, onSortingChange, handleSort, sortState, sortDirectionPre } =
    useTableSort()
  const { showAllColumns, setShowAllColumns } = useColumnVisibility()
  const { columns } = useTableColumns()

  const table = useReactTable({
    data: filteredRows,
    columns: columns.filter(
      col =>
        showAllColumns || !(col.meta as { extra?: boolean } | undefined)?.extra,
    ),
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
            handleSort={handleSort}
            sortState={sortState}
            sortDirectionPre={sortDirectionPre}
          />
          <TableBody rows={table.getRowModel().rows} />
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className={styles.paginationButton}
            onClick={() => table.previousPage()}
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
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className={styles.paginationButton}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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
      )}
    </>
  )
}
