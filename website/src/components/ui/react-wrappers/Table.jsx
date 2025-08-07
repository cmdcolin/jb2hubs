import React from 'react'

export function Table({ children, className = '' }) {
  return <table className={`table ${className}`}>{children}</table>
}

export function TableHeader({ children, className = '' }) {
  return <thead className={`tableHeader ${className}`}>{children}</thead>
}

export function TableBody({ children, className = '' }) {
  return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className = '' }) {
  return <tr className={`tableRow ${className}`}>{children}</tr>
}

export function TableHeaderCell({ children, className = '', onClick }) {
  return (
    <th onClick={onClick} className={`tableHeaderCell ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }) {
  return <td className={`tableCell ${className}`}>{children}</td>
}
