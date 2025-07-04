import Link2 from 'next/link'

import AboutDropdown from './AboutDropdown.tsx'
import GenomesDropdown from './GenomesDropdown.tsx'

export default function Header() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link2 href="/" className="btn btn-ghost text-xl">
          JBrowse 2 hubs
        </Link2>
        <GenomesDropdown />
        <AboutDropdown />
      </div>
    </div>
  )
}
