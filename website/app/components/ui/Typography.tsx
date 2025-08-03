import { ReactNode } from 'react'

import styles from './Typography.module.css'

interface HeadingProps {
  children: ReactNode
  className?: string
}

export function H1({ children, className = '' }: HeadingProps) {
  return <h1 className={`${styles.h1} ${className}`}>{children}</h1>
}

export function H2({ children, className = '' }: HeadingProps) {
  return <h2 className={`${styles.h2} ${className}`}>{children}</h2>
}

export function H3({ children, className = '' }: HeadingProps) {
  return <h3 className={`${styles.h3} ${className}`}>{children}</h3>
}

export function H4({ children, className = '' }: HeadingProps) {
  return <h4 className={`${styles.h4} ${className}`}>{children}</h4>
}

interface TextProps {
  children: ReactNode
  className?: string
}

export function P({ children, className = '' }: TextProps) {
  return <p className={`${styles.p} ${className}`}>{children}</p>
}

export function Italic({ children, className = '' }: TextProps) {
  return <i className={`${styles.italic} ${className}`}>{children}</i>
}

interface DescriptionListProps {
  children: ReactNode
  className?: string
}

export function DL({ children, className = '' }: DescriptionListProps) {
  return <dl className={`${styles.dl} ${className}`}>{children}</dl>
}

export function DT({ children, className = '' }: TextProps) {
  return <dt className={`${styles.dt} ${className}`}>{children}</dt>
}

export function DD({ children, className = '' }: TextProps) {
  return <dd className={`${styles.dd} ${className}`}>{children}</dd>
}
