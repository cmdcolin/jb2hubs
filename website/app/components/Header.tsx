import Link from 'next/link'

import AboutDropdown from './AboutDropdown.tsx'
import GenomesDropdown from './GenomesDropdown.tsx'

export default function Header() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          JBrowse 2 hubs
        </Link>
        <GenomesDropdown />
        <AboutDropdown />
      </div>
    </div>
  )
}
