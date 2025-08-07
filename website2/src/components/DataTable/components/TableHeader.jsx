import { flexRender } from '@tanstack/react-table'

import styles from './TableHeader.module.css'

export default function TableHeader({
  headerGroups,
  handleSort,
  sortState,
  sortDirectionPre,
}) {
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
