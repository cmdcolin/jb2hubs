import { ReactNode } from 'react'
import Link from 'next/link'
import styles from './Link.module.css'

interface StyledLinkProps {
  href: string
  children: ReactNode
  rel?: string
  className?: string
}

export function StyledLink({
  href,
  children,
  className = '',
}: StyledLinkProps) {
  return (
    <Link
      prefetch={false}
      href={href}
      className={`${styles.styledLink} ${className}`}
    >
      {children}
    </Link>
  )
}

export function ButtonLink({
  href,
  children,
  className = '',
  variant = 'primary',
}: StyledLinkProps & { variant?: 'primary' | 'secondary' | 'outline' }) {
  return (
    <Link
      href={href}
      className={`${styles.buttonLink} ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
