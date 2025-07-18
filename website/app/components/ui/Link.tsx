import { ReactNode } from 'react'

import Link from 'next/link'

interface StyledLinkProps {
  href: string
  children: ReactNode
  rel?: string
  className?: string
  external?: boolean
}

export function StyledLink({
  href,
  children,
  rel,
  className = '',
  external = false,
}: StyledLinkProps) {
  const baseStyles =
    'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-[#25c2a0] hover:underline transition-colors duration-200 font-medium'

  const externalStyles = external ? 'inline-flex items-center gap-1' : ''

  return (
    <Link
      prefetch={false}
      href={href}
      className={`${baseStyles} ${externalStyles} ${className}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : rel}
    >
      {children}
      {external && (
        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
      )}
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
