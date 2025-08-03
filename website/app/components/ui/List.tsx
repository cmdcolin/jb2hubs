import { ReactNode } from 'react'
import styles from './List.module.css'

interface ListProps {
  children: ReactNode
  className?: string
}

export function UL({ children, className = '' }: ListProps) {
  return <ul className={`${styles.ul} ${className}`}>{children}</ul>
}

export function OL({ children, className = '' }: ListProps) {
  return <ol className={`${styles.ol} ${className}`}>{children}</ol>
}

export function LI({ children, className = '' }: ListProps) {
  return <li className={className}>{children}</li>
}
