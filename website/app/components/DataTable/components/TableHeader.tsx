'use client'
import { flexRender } from '@tanstack/react-table'

import type { AssemblyData } from '../../util'
import type { HeaderGroup } from '@tanstack/react-table'

interface TableHeaderProps {
  headerGroups: HeaderGroup<NonNullable<AssemblyData>>[]
  handleSort: (columnId: string) => void
  sortState: string | null
  sortDirectionPre: string | null
}

export default function TableHeader({
  headerGroups,
  handleSort,
  sortState,
  sortDirectionPre,
}: TableHeaderProps) {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={header.column.getCanSort() ? 'cursor-pointer' : ''}
              onClick={
                header.column.getCanSort()
                  ? () => {
                      handleSort(header.id)
                    }
                  : undefined
              }
            >
              {flexRender(header.column.columnDef.header, header.getContext())}{' '}
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
  )
}
