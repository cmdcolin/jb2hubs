import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`border-collapse border border-gray-300 dark:border-gray-600 ${className}`}>
      {children}
    </table>
  )
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={`${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}>
      {children}
    </tr>
  )
}

export function TableHeaderCell({ children, className = '' }: TableProps) {
  return (
    <th className={`border border-gray-300 dark:border-gray-600 px-2 py-1 text-left font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`border border-gray-300 dark:border-gray-600 px-2 py-1 text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </td>
  )
}