import { flexRender, Row } from '@tanstack/react-table';

interface TableBodyProps<TData> {
  rows: Row<TData>[];
}

export default function TableBody<TData>({ rows }: TableBodyProps<TData>) {
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
  );
}
