'use client'

import { usePathname } from 'next/navigation'

import { StyledLink } from './ui/Link.tsx'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  return (
    <nav className="text-sm breadcrumbs">
      <ul>
        <li>
          <StyledLink href="/">Home</StyledLink>
        </li>
        {pathSegments
          .filter(f => f !== 'accession' && f !== 'hubs')
          .map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/')
            const isLast = index === pathSegments.length - 1
            const displaySegment =
              segment === 'ucsc'
                ? segment.toUpperCase()
                : segment.charAt(0).toUpperCase() + segment.slice(1) // Capitalize first letter

            return (
              <li key={href}>
                {isLast ? (
                  <span className="inline">{displaySegment}</span>
                ) : (
                  <StyledLink className="inline" href={href}>
                    {displaySegment}
                  </StyledLink>
                )}
              </li>
            )
          })}
      </ul>
    </nav>
  )
}
