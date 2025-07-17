'use client'
import { flexRender } from '@tanstack/react-table'

import type { AssemblyData } from '../../util'
import type { Row } from '@tanstack/react-table'

interface TableBodyProps {
  rows: Row<NonNullable<AssemblyData>>[]
}

export default function TableBody({ rows }: TableBodyProps) {
  return (
    <tbody>
      {rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
