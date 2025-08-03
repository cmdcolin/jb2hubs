'use client'
import {
  getCoreRowModel,
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

export default function DataTable({ rows }: { rows: AssemblyData[] }) {
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
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    </>
  )
}
