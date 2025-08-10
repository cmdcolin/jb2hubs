import { flexRender } from '@tanstack/react-table'

import styles from './TableHeader.module.css'

import type { HeaderGroup, SortDirection } from '@tanstack/react-table'

interface TableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[]
  handleSort: (id: string) => void
  sortState: string
  sortDirectionPre: SortDirection | false | '' // Allow empty string
}

export default function TableHeader<TData>({
  headerGroups,
  handleSort,
  sortState,
  sortDirectionPre,
}: TableHeaderProps<TData>) {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={header.column.getCanSort() ? styles.cursorPointer : ''}
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
