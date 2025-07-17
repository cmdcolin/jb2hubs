import { ReactNode } from 'react'

interface ListProps {
  children: ReactNode
  className?: string
}

export function UL({ children, className = '' }: ListProps) {
  return (
    <ul
      className={`list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </ul>
  )
}

export function OL({ children, className = '' }: ListProps) {
  return (
    <ol
      className={`list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </ol>
  )
}

export function LI({ children, className = '' }: ListProps) {
  return <li className={className}>{children}</li>
}

