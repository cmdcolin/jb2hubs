import React from 'react'

export function StyledLink({ href, children, rel, className = '' }) {
  return (
    <a href={href} rel={rel} className={`styledLink ${className}`}>
      {children}
    </a>
  )
}

export function ButtonLink({
  href,
  children,
  className = '',
  variant = 'primary',
}) {
  return (
    <a href={href} className={`buttonLink ${variant} ${className}`}>
      {children}
    </a>
  )
}
