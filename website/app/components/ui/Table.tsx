import { ReactNode } from 'react'
import styles from './Table.module.css'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return <table className={`${styles.table} ${className}`}>{children}</table>
}

export function TableHeader({ children, className = '' }: TableProps) {
  return <thead className={`${styles.tableHeader} ${className}`}>{children}</thead>
}

export function TableBody({ children, className = '' }: TableProps) {
  return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className = '' }: TableProps) {
  return <tr className={`${styles.tableRow} ${className}`}>{children}</tr>
}

export function TableHeaderCell({
  children,
  className = '',
  onClick,
}: TableProps & { onClick?: (event: unknown) => void }) {
  return (
    <th onClick={onClick} className={`${styles.tableHeaderCell} ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: TableProps) {
  return <td className={`${styles.tableCell} ${className}`}>{children}</td>
}
