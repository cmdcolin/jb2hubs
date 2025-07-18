import { ReactNode } from 'react'

interface HeadingProps {
  children: ReactNode
  className?: string
}

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1
      className={`text-4xl font-normal text-gray-900 dark:text-gray-100 leading-tight ${className} pb-4 pt-4 mt-10`}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className = '' }: HeadingProps) {
  return (
    <h2
      className={`text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight ${className} pb-4 pt-4`}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }: HeadingProps) {
  return (
    <h3
      className={`text-xl font-semibold text-gray-800 dark:text-gray-200 leading-tight ${className} pb-2 pt-2`}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className = '' }: HeadingProps) {
  return (
    <h4
      className={`inline text-lg font-medium text-gray-800 dark:text-gray-200 leading-tight ${className}`}
    >
      {children}
    </h4>
  )
}

interface TextProps {
  children: ReactNode
  className?: string
}

export function P({ children, className = '' }: TextProps) {
  return (
    <p className={`text-gray-700 dark:text-gray-300  ${className} pb-2 pt-2`}>
      {children}
    </p>
  )
}

export function Italic({ children, className = '' }: TextProps) {
  return (
    <i className={`text-gray-600 dark:text-gray-400 italic ${className}`}>
      {children}
    </i>
  )
}

interface DescriptionListProps {
  children: ReactNode
  className?: string
}

export function DL({
  children,
  className = 'mt-4 mb-4',
}: DescriptionListProps) {
  return <dl className={className}>{children}</dl>
}

export function DT({ children, className = '' }: TextProps) {
  return (
    <dt className={`font-bold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </dt>
  )
}

export function DD({ children, className = '' }: TextProps) {
  return (
    <dd
      className={`text-gray-700 dark:text-gray-300 leading-relaxed ${className}`}
    >
      {children}
    </dd>
  )
}
