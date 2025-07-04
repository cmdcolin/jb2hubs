'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  return (
    <nav className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/">Home</Link>
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
                  <span>{displaySegment}</span>
                ) : (
                  <Link href={href}>{displaySegment}</Link>
                )}
              </li>
            )
          })}
      </ul>
    </nav>
  )
}
