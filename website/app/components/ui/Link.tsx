import { ReactNode } from 'react'

import Link from 'next/link'

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
  const baseStyles =
    'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-[#25c2a0] hover:underline transition-colors duration-200 font-normal'

  return (
    <Link prefetch={false} href={href} className={`${baseStyles} ${className}`}>
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
  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
    secondary:
      'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900',
  }

  return (
    <Link
      href={href}
      className={`inline-block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
